
import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class ByteArrayInputStream extends RandomAccessFile {

    constructor(buff:number[]) {
        const binBuffer = new BinBuffer(buff);
        super(binBuffer);
    }

    public read2():number {
        return this.binBuffer.readUInt8();
    }

    public reset(): void {
        this.binBuffer.setPointer(0);
    }
    public skip(n:number): void {
        this.binBuffer.skip(n);
    }

}
