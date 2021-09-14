/**
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
import {SlidingDicDecoder} from "./slidingDicDecoder";
import {LhaFileInputStream} from "./lhaFile";


export class LzsDecoder extends SlidingDicDecoder {
    private static readonly MAGIC:number = 18;

    private matchPosition:number = 0;

    public constructor(_in:LhaFileInputStream, originalSize:number) {
        super(_in, originalSize, 11, 256 - 2);
    }

    protected decodeCode():number {
        const b:number = this.getBits(1);
        if (b !== 0) {
            return(this.getBits(8));
        } else {
            this.matchPosition = this.getBits(11);
            return(this.getBits(4) + 0x100);
        }
    }

    protected decodePosition():number {
        return((this.bufferPointerEnd - this.matchPosition - LzsDecoder.MAGIC) & this.dictionaryMask);
    }

    protected initRead():void {
        this.fillBitBuffer(2 * LzsDecoder.CHAR_BIT);
    }


}
