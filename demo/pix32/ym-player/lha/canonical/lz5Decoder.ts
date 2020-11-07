/**
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
import {SlidingDicDecoder} from "./slidingDicDecoder";
import {LhaFileInputStream} from "./lhaFile";

export class Lz5Decoder extends SlidingDicDecoder {
    private readonly MAGIC:number = 19;

    private flag:number = 0;
    private flagCount:number = 0;
    private matchPosition:number = 0;

    public constructor(_in:LhaFileInputStream, originalSize:number) {
        super(_in, originalSize, 12, Lz5Decoder.OFFSET);
    }

    protected decodeCode():number {
        if (this.flagCount === 0) {
            this.flagCount = 8;
            this.flag = this._in.read()
        }
        --this.flagCount;
        let c:number = this._in.read()
        if ((this.flag & 0x0001) === 0) {
            this.matchPosition = c;
            c = this._in.read();
            this.matchPosition += (c & 0x00F0) << 4;
            c &= 0x000F;
            c |= 0x0100;
        }
        this.flag >>>= 1;
        return(c);
    }

    protected decodePosition():number {
        return((this.bufferPointerEnd - this.matchPosition - this.MAGIC) & this.dictionaryMask);
    }

    protected initRead():void {
        this.flagCount = 0;
        for (let i:number = 0; i < 256; ++i) {
            for (let j:number = 0; j < 13; ++j) {
                this.dictionaryBuffer[i * 13 + 18 + j] = i;
            }
            this.dictionaryBuffer[256 * 13 + 18 + i] = i;
            this.dictionaryBuffer[256 * 13 + 256 + 18 + i] = (255 - i);
        }
        for (let i:number = 0; i < 128; ++i) {
            this.dictionaryBuffer[256 * 13 + 512 + 18] = 0;
        }
        for (let i:number = 0; i < (128 - 18); ++i) {
            this.dictionaryBuffer[256 * 13 + 512 + 128 + 18] = 0x20;
        }
    }



}
