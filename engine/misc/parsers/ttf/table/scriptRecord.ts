import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class ScriptRecord {

    public readonly tag: number;
    public readonly offset: number;

    constructor(raf: RandomAccessFile) {
        this.tag = raf.readInt();
        this.offset = raf.readUnsignedShort();
    }

}
