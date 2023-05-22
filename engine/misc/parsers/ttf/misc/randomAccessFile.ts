import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";


export class RandomAccessFile {

    constructor(protected binBuffer: BinBuffer) {
    }

    public readUnsignedShort():number {
        return this.binBuffer.readUInt16();
    }
    public readUnsignedByte():number {
        return this.binBuffer.readUInt8();
    }
    public readInt():number {
        return this.binBuffer.readInt32();
    }
    public readByte():number {
        return this.binBuffer.readInt8();
    }
    public read(arr:number[]):void {
        const mem = this.binBuffer.readInts8(arr.length);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = mem[i];
        }
    }
    public readShort():number {
        return this.binBuffer.readInt16();
    }
    public readLong() {
        return this.binBuffer.readInt64();
    }
    public readChar():string {
        const ch = this.binBuffer.readUInt16();
        return String.fromCharCode(ch);
    }
    public seek(n:number):void {
        if (n<0) throw new Error(`wrong argument: ${n}`);
        this.binBuffer.setPointer(n);
    }
    public getFilePointer():number {
        return this.binBuffer.getPointer();
    }
    public readFully(arr:number[]):void {
        this.read(arr);
    }
}
