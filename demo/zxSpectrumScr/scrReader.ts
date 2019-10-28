import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";

const W = 256;
const H = 192;


const INT = (n:number):number=>{
    return ~~n;
};

export class ScrReader {

    constructor(private game:Game,private data:ArrayBuffer){

    }

    public createTextureLink():ResourceLink<Texture>{
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        const gl:WebGLRenderingContext = renderer.getNativeContext();
        const t:Texture = new Texture(gl);

        const link:ResourceLink<Texture> = new ResourceLink<Texture>('url'+Math.random()+'_'+Math.random());
        renderer.putToCache(link,t);

        const bitmap = this.read();

        t.setRawData(new Uint8Array(bitmap),W,H);
        link.setTarget(t);
        return link;
    }

    private read():number[]{
        const view = new Int8Array(this.data);
        const arr = new Array(W*H*4);
        let i = 0;
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {

                // Связь между координатами x и y и адресами в .SCR файле следующая:
                //     INT (x/8)+1792*INT (y/64)-2016*INT (y/8)+256*y
                // Младшие три бита координаты x определяют какой бит в адресе соответствует
                // данному пикселу
                const addr = INT(x/8)+1792*INT(y/64)-2016*INT(y/8)+256*y;
                const first3bits = 8 - (x & 0b111);
                const mask = first3bits===0?0:0b1<<first3bits;
                const pixelSet:0|1 = (view[addr] & mask)>0?1:0;

                // Для файлов длиной 6912 байт, следующие 768 байт отвечают за каждые 8x8
                // точек:
                //     Адрес в блоке атрибутов, соответствующий точке x,y вычисляется по формуле:
                //     6144+INT (x/8)+32*INT (y/8)
                // Младшие три бита в байте атрибутов определяют цвет "включенных" точек
                // Биты 3-5 соответствуют цвету фона ("выключенных" точек).
                // Бит 6 - бит яркости.

                const attributeAddr = 6144 + INT(x/8)+32*INT(y/8);
                const attributeValue = view[attributeAddr];


                const brightness = (attributeValue & 0b1000000)>0?255:200;

                const colorOn:[number,number,number] = [
                    (attributeValue & 0b001)>0?brightness:0,
                    (attributeValue & 0b010)>0?brightness:0,
                    (attributeValue & 0b100)>0?brightness:0,
                ];

                const colorOff:[number,number,number] = [
                    (attributeValue & 0b001000)>0?255:0,
                    (attributeValue & 0b010000)>0?255:0,
                    (attributeValue & 0b100000)>0?255:0,
                ];


                if (pixelSet) {
                    arr[i]   = colorOn[1]; // r
                    arr[i+1] = colorOn[2]; // g
                    arr[i+2] = colorOn[0]; // b
                } else {
                    arr[i]   = colorOff[1]; // r
                    arr[i+1] = colorOff[2]; // g
                    arr[i+2] = colorOff[0]; // b
                }

                arr[i+3] = 255; // a
                i+=4;
            }
        }
        return arr;
    }

}