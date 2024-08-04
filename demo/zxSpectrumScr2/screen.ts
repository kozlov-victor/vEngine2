import {BORDER, H, W} from "./index";
import {DataTexture} from "@engine/renderer/webGl/base/texture/dataTexture";
import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";
import {OneLenSeconds, ZeroLenSeconds} from "./tapePlayer";


export const wait = (n:number)=>{
    return new Promise<void>(resolve=>{
        setTimeout(resolve,n)
    });
}


const INT = (n:number):number=>{
    return ~~n;
};

class Border {
    private readonly texture:DataTexture;
    private pointerX = 0;
    private pointerY = 0;
    private stopped = false;

    private readonly pixelsPer0: number;
    private readonly pixelsPer1: number;
    private readonly BORDER_ON:[Uint8,Uint8,Uint8,Uint8] = [0,0,100,255];
    private readonly BORDER_OFF:[Uint8,Uint8,Uint8,Uint8] = [100,100,0,255];

    constructor(scene:Scene){
        const game = scene.getGame();
        const rayVelocityPixelsSeconds = game.width*game.height/(1/50);
        this.pixelsPer0 = rayVelocityPixelsSeconds * ZeroLenSeconds;
        this.pixelsPer1 = rayVelocityPixelsSeconds * OneLenSeconds;
        this.texture = new DataTexture(game,game.width, game.height);
        this._reset();
        const image = new Image(game,this.texture);
        image.appendTo(scene);
    }

    public reset():void{
        this.stopped = true;
        this._reset();
    }

    private _reset():void{
        for (let y=0;y<this.texture.size.height;y++) {
            for (let x=0;x<this.texture.size.width;x++) {
                this.texture.setRawPixelAt(x,y,0,0,0,255);
            }
        }
    }

    public readNextByte(b:Uint8):void {
        for (let n=0;n<8;n++) {
            const bit = (b & n) > 0?1:0;
            const pixelsPerBit = bit?this.pixelsPer1:this.pixelsPer0;
            for (let k=0;k<pixelsPerBit;k++) {
                if (this.stopped) break;
                this.nextPoint(bit);
            }
        }
    }

    private nextPoint(bit:0|1):void {
        const [r,g,b,a] = bit?[...this.BORDER_ON]:[...this.BORDER_OFF];
        this.texture.setRawPixelAt(this.pointerX,this.pointerY,r,g,b,a);
        this.pointerX++;
        if (this.pointerX>this.texture.size.width-1) {
            this.pointerX = 0;
            this.pointerY++;
            if (this.pointerY>this.texture.size.height-1) this.pointerY = 0;
        }
    }

    public flip() {
        this.texture.flush();
    }

    public destroy() {
        this.texture.destroy();
    }

}

export class ZxScreen {

    private border: Border;
    private readonly texture: DataTexture;

    private readonly MEM_SIZE = 6912;

    private flashOn = false;
    private videoMemory: Uint8[] = new Array(this.MEM_SIZE).fill(0);
    private pointer = 0;


    constructor(scene:Scene) {
        this.border = new Border(scene);
        const game = scene.getGame();
        this.texture = new DataTexture(game, W, H);
        const image = new Image(game,this.texture);
        image.pos.setXY(BORDER);
        image.appendTo(scene);
        game.getCurrentScene().setInterval(() => {
            this.flashOn = !this.flashOn;
        }, 1000);
        game.getCurrentScene().setInterval(() => {
            this.flip();
        }, 1);
    }

    public async testMemory() {
        let cnt = 0;
        const waitTime = 10;
        for (const i of this.videoMemory) {
            this.videoMemory[cnt] = 0b00000010;
            if (cnt%100===0) {
                await wait(waitTime);
            }
            cnt++;
        }
        await wait(waitTime);
        cnt = 0;
        for (const i of this.videoMemory) {
            this.videoMemory[cnt] = 0b00000000;
            if (cnt%100===0) {
                await wait(waitTime);
            }
            cnt++;
        }
        for (let i=6144;i<this.videoMemory.length;i++) {
            this.videoMemory[i] = 0b00000111;
        }
    }

    public readNextByte(b:Uint8): void {
        if (this.pointer>=this.MEM_SIZE) {
            console.error('video memory overflow');
            return;
        }
        this.videoMemory[this.pointer] = b;
        this.pointer++;
        this.border.readNextByte(b);
    }

    private flip(): void {
        const mem = this.videoMemory;
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {

                // Связь между координатами x и y и адресами в .SCR файле следующая:
                //     INT (x/8)+1792*INT (y/64)-2016*INT (y/8)+256*y
                // Младшие три бита координаты x определяют какой бит в адресе соответствует
                // данному пикселу
                const addr = INT(x / 8) + 1792 * INT(y / 64) - 2016 * INT(y / 8) + 256 * y;
                const first3bits = x & 0b111;
                let pixelSet = BinBuffer.isBitSet(7-first3bits,mem[addr])? 1 : 0;

                // Для файлов длиной 6912 байт, следующие 768 байт отвечают за каждые 8x8
                // точек:
                //     Адрес в блоке атрибутов, соответствующий точке x,y вычисляется по формуле:
                //     6144+INT (x/8)+32*INT (y/8)
                // Младшие три бита в байте атрибутов определяют цвет "включенных" точек
                // Биты 3-5 соответствуют цвету фона ("выключенных" точек).
                // Бит 6 - бит яркости.
                //Бит 7 - признак мигания

                const attributeAddr = 6144 + INT(x / 8) + 32 * INT(y / 8);
                const attributeValue = mem[attributeAddr];

                const brightness = (attributeValue & 0b1000000) > 0 ? 255 : 200;

                const colorOn: [Uint8, Uint8, Uint8] = [
                    (attributeValue & 0b001) > 0 ? brightness : 0,
                    (attributeValue & 0b010) > 0 ? brightness : 0,
                    (attributeValue & 0b100) > 0 ? brightness : 0,
                ];

                const colorOff: [Uint8, Uint8, Uint8] = [
                    (attributeValue & 0b001000) > 0 ? 255 : 0,
                    (attributeValue & 0b010000) > 0 ? 255 : 0,
                    (attributeValue & 0b100000) > 0 ? 255 : 0,
                ];

                const flash = (attributeValue & 0b10000000) > 0 ? 1 : 0;
                if (flash === 1 && this.flashOn) pixelSet = pixelSet === 1 ? 0 : 1;

                let r: Uint8, g: Uint8, b: Uint8;
                const a: Uint8 = 255;

                if (pixelSet) {
                    r = colorOn[1]; // r
                    g = colorOn[2]; // g
                    b = colorOn[0]; // b
                } else {
                    r = colorOff[1]; // r
                    g = colorOff[2]; // g
                    b = colorOff[0]; // b
                }

                this.texture.setRawPixelAt(x, y, r, g, b, a);

            }
        }
        this.texture.flush();
        this.border.flip();
    }

    public clearBorder() {
        this.border.reset();
    }

    public destroy() {
        this.texture.destroy();
        this.border.destroy();
    }

}
