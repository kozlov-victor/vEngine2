import {LhDecoder} from "./lhDecoder";
import {LhaException} from "./lhaException";
import {SlidingDicDecoder} from "./slidingDicDecoder";
import {LhaFileInputStream} from "./lhaFile";

export class Lh1Decoder extends LhDecoder {

    constructor(_in:LhaFileInputStream, originalSize:number) {
        super(_in, originalSize, 12, SlidingDicDecoder.OFFSET);
    }

    protected decodeCode(): number {
        throw new LhaException("not realized yet");
    }

    protected decodePosition(): number {
        throw new LhaException("not realized yet");
    }

    protected initRead(): void {
        throw new LhaException("not realized yet");
    }
}
