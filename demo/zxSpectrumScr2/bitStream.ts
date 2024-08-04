import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";

export class BitStream {

    private bytePointer = 0;
    private bitPointer = 0;
    private bytesRead:Uint8[] = [];
    private eof = false;
    private readonly arr:Uint8Array;

    constructor(buff:ArrayBuffer) {
        this.arr = new Uint8Array(buff);
    }

    public isEof() {
        return this.eof;
    }

    public readNextBit():1|0 {
        if (this.eof) {
            return 0;
        }
        const currentByte = this.arr[this.bytePointer] as Uint8;
        const currentBit = BinBuffer.isBitSet(this.bitPointer,currentByte);
        this.bitPointer++;
        if (this.bitPointer===8) {
            this.bitPointer=0;
            this.bytesRead.push(currentByte);
            this.bytePointer++;
            if (this.bytePointer===this.arr.length) {
                this.eof = true;
            }
        }
        return currentBit?1:0;
    }

    public flushReadBytes() {
        const buff = [...this.bytesRead];
        this.bytesRead.length = 0;
        return buff;
    }

}
