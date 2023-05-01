import {BinBuffer} from "../pix32/ym-player/internal/binBuffer";
import {DataTexture} from "@engine/renderer/webGl/base/dataTexture";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class OtaReader {

    constructor(private game: Game, private src:number[]|ArrayBuffer) {

    }

    public asImage() {
        const buffer = new BinBuffer(this.src);
        const info = buffer.readUInt8();
        if (info!=0) throw new Error(`wrong prolog: ${info}`);
        const width = buffer.readUInt8() as number;
        const height = buffer.readUInt8() as number;
        const numColors = buffer.readUInt8();
        if (numColors!==1) throw new Error(`wrong number of colors: ${numColors}`);

        console.log(width,height);

        const rowChunkLength = width / 8;
        const texture = new DataTexture(this.game,width,height);
        let x = 0;
        let y = 0;
        const colorOff  = ColorFactory.fromCSS('#9189ff');
        const colorOn = ColorFactory.fromCSS('#0113c7');
        for (let j = 0;j<height;j++) {
            const row = buffer.readUints8(rowChunkLength);
            row.forEach(n=>{
                for (let i=0;i<8;i++) {
                    if (x<width && y<height) {
                        const bit = BinBuffer.isBitSet(7-i,n as number);
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
