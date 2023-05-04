import {ISize} from "@engine/geometry/size";
import {BinBuffer} from "../pix32/ym-player/internal/binBuffer";
import {DataTexture} from "@engine/renderer/webGl/base/dataTexture";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

const leftPad = (s:string,toLength:number):string=>{
    let pad = "";
    for (let i=s.length;i<toLength;i++) pad+="0";
    return pad + s;
};

const toBin = (n:number)=>{
    return leftPad(n.toString(2), 8).
        split('').reverse().join('');
};

export class XbmReader {

    private data = {
        array: [] as number[],
        width: 0,
        height: 0
    }

    constructor(private game: Game, src:string) {
        const array = this.readArray(src);
        const {width,height} = this.readSize(src);
        this.data = {
            array,
            width,
            height
        }
    }

    private readArray(src: string):number[] {
        const raw =
            src.split('{')[1].replace('};', '').
            split('\n').join('').
            split(' ').join('').
            replace(']', '');
        const rawArr = raw.split(',');
        return rawArr.filter(it=>it.length).map(it=>parseInt(it,16))
    }

    private readSize(src: string):ISize {
        const valueWords = src.split(' ');
        const width = parseInt(valueWords[2]);
        const height = parseInt(valueWords[4]);
        return {width,height};
    }

    public asString():string {
        const rowChunkLength = this.data.array.length / this.data.height;
        const buffer = new BinBuffer(this.data.array);
        let result = '';
        for (let j = 0;j<this.data.height;j++) {
            const row = new Array<Uint8>(rowChunkLength);
            buffer.readUints8ToArray_2(row);
            for (let i = 0;i<row.length;i++) {
                if (row[i]===undefined) row[i] = 0;
            }
            row.forEach(n=>{
                result+=toBin(n);
            });
            result+='\n';
        }
        return result;
    }

    public asImage() {
        const rowChunkLength = this.data.array.length / this.data.height;
        const texture = new DataTexture(this.game,this.data.width,this.data.height);
        const buffer = new BinBuffer(this.data.array);
        let x = 0;
        let y = 0;
        const colorOff  = ColorFactory.fromCSS('#9189ff');
        const colorOn = ColorFactory.fromCSS('#0113c7');
        for (let j = 0;j<this.data.height;j++) {
            const row = new Array<Uint8>(rowChunkLength);
            buffer.readUints8ToArray_2(row);
            for (let i = 0;i<row.length;i++) {
                if (row[i]===undefined) row[i] = 0;
            }
            row.forEach(n=>{
                for (let i=0;i<8;i++) {
                    if (x<this.data.width && y<this.data.height) {
                        const bit = BinBuffer.isBitSet(i,n);
                        if (bit) texture.setRawPixelAt(x,y,colorOn.r,colorOn.g,colorOn.b,colorOn.a);
                        else texture.setRawPixelAt(x,y,colorOff.r,colorOff.g,colorOff.b,colorOff.a);
                    }
                    x++;
                }
            });
            x=0;
            y++;
        }
        texture.flush();
        return new Image(this.game, texture);
    }


}
