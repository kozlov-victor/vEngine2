import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";
import {DataTexture} from "@engine/renderer/webGl/base/dataTexture";
import {H, W, BORDER} from "./index";
import {AudioStream} from "./audioStream";
import {ITexture} from "@engine/renderer/common/texture";



const INT = (n:number):number=>{
    return ~~n;
};

class Border {
    public readonly link:ResourceLink<Texture>;
    private readonly texture:DataTexture;
    private pointerX:number = 0;
    private pointerY:number = 0;

    private readonly pixelsPerBit:number = 1000;
    private readonly BORDER_ON:[byte,byte,byte,byte] = [0,0,100,255];
    private readonly BORDER_OFF:[byte,byte,byte,byte] = [100,100,0,255];

    constructor(game:Game){
        const renderer:WebGlRenderer = game.getRenderer() as WebGlRenderer;
        const gl:WebGLRenderingContext = renderer.getNativeContext();
        this.texture = new DataTexture(game,W+BORDER*2, H+BORDER*2);
        this.link = ResourceLink.create(this.texture);
        this.reset();
    }

    public reset(){
        for (let y:number=0;y<this.texture.size.height;y++) {
            for (let x:number=0;x<this.texture.size.width;x++) {
                this.texture.setRawPixelAt(x,y,0,0,0,255);
            }
        }
        this.texture.flush();
    }

    public readNextByte(b:byte) {
        for (let n:number=0;n<8;n++) {
            const bit:1|0 = (b & n) > 0?1:0;
            for (let k:number=0;k<this.pixelsPerBit;k++) {
                this.nextPoint(bit);
            }
        }
        this.texture.flush();
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
}

class Screen {

    public border:Border;
    public link:ResourceLink<ITexture>;
    public stream:AudioStream;

    private flashOn:boolean = false;
    private view:Int8Array = new Int8Array(this.data);
    private videoMemory:byte[] = new Array(this.data.byteLength).fill(0);
    private pointer:number = 0;
    private loadingCompleted:boolean = false;
    private memoryTest1Completed:boolean = false;
    private memoryTest2Completed:boolean = false;

    constructor(private game:Game,private data:ArrayBuffer){

        const t:DataTexture = new DataTexture(this.game,W,H);
        this.link = t.getLink();
        this.stream = new AudioStream(this.view);

        game.getCurrScene().setInterval(()=>{
            this.flashOn = !this.flashOn;
        },1000);
        this.game.getCurrScene().setInterval(()=>{
            this.update(t);
        },1);
    }

    public update(texture:DataTexture){
        this.readMemory(texture);
        if (this.memoryTest2Completed) {
            if (!this.loadingCompleted) this.loadNextChunk();
        }
        else this.testNextChunk();
    }

    private loadNextChunk(){
        const chunkSize = 5;
        for (let i:number=this.pointer;i<this.pointer+chunkSize;i++) {
            if (this.pointer>this.view.length) {
                this.loadingCompleted = true;
                this.border.reset();
                this.stream.stop();
                return;
            }
            this.videoMemory[i] = this.view[i] as byte;
            this.border.readNextByte(this.videoMemory[i]);
        }
        this.pointer+=chunkSize;
        this.stream.setPointer(this.pointer);
    }

    private testNextChunk(){
        const chunkSize = 128;
        const testValue = this.memoryTest1Completed?0b00000000:0b00000010;
        for (let i:number=this.pointer;i<this.pointer+chunkSize;i++) {
            if (this.pointer>this.view.length) {
                if (this.memoryTest1Completed) {
                    this.memoryTest2Completed = true;
                    for (let k:number=6144;k<this.videoMemory.length;k++) {
                        this.videoMemory[k] = 0b00000111;
                    }
                }
                else this.memoryTest1Completed = true;
                this.pointer = 0;
                return;
            }
            else this.videoMemory[i] = testValue;
        }
        this.pointer+=chunkSize;
    }

    private readMemory(texture:DataTexture):void{
        const mem = this.videoMemory;
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {

                // Связь между координатами x и y и адресами в .SCR файле следующая:
                //     INT (x/8)+1792*INT (y/64)-2016*INT (y/8)+256*y
                // Младшие три бита координаты x определяют какой бит в адресе соответствует
                // данному пикселу
                const addr = INT(x/8)+1792*INT(y/64)-2016*INT(y/8)+256*y;
                const first3bits = 8 - (x & 0b111);
                const mask = first3bits===0?0:0b1<<first3bits;
                let pixelSet:0|1 = (mem[addr] & mask)>0?1:0;

                // Для файлов длиной 6912 байт, следующие 768 байт отвечают за каждые 8x8
                // точек:
                //     Адрес в блоке атрибутов, соответствующий точке x,y вычисляется по формуле:
                //     6144+INT (x/8)+32*INT (y/8)
                // Младшие три бита в байте атрибутов определяют цвет "включенных" точек
                // Биты 3-5 соответствуют цвету фона ("выключенных" точек).
                // Бит 6 - бит яркости.
                //Бит 7 - признак мигания

                const attributeAddr = 6144 + INT(x/8)+32*INT(y/8);
                const attributeValue = mem[attributeAddr];

                const brightness = (attributeValue & 0b1000000)>0?255:200;

                const colorOn:[byte,byte,byte] = [
                    (attributeValue & 0b001)>0?brightness:0,
                    (attributeValue & 0b010)>0?brightness:0,
                    (attributeValue & 0b100)>0?brightness:0,
                ];

                const colorOff:[byte,byte,byte] = [
                    (attributeValue & 0b001000)>0?255:0,
                    (attributeValue & 0b010000)>0?255:0,
                    (attributeValue & 0b100000)>0?255:0,
                ];

                const flash = (attributeValue & 0b10000000)>0?1:0;
                if (flash===1 && this.flashOn) pixelSet = pixelSet===1?0:1;

                let r:byte,g:byte,b:byte;
                const a:byte = 255;

                if (pixelSet) {
                    r = colorOn[1]; // r
                    g = colorOn[2]; // g
                    b = colorOn[0]; // b
                } else {
                    r   = colorOff[1]; // r
                    g = colorOff[2]; // g
                    b = colorOff[0]; // b
                }

                texture.setRawPixelAt(x,y,r,g,b,a);

            }
        }
        texture.flush();

    }
}

export class ScrReader {

    public links: {screenLink:ResourceLink<ITexture>,borderLink:ResourceLink<Texture>};

    constructor(private game:Game,private data:ArrayBuffer){
        const screen = new Screen(game,data);
        screen.border = new Border(this.game);
        this.links = {screenLink:screen.link,borderLink:screen.border.link};
    }
    


}