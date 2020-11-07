import {LhDecoder} from "./lhDecoder";
import {LhaException} from "./lhaException";

export class Lh3Decoder extends LhDecoder {

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