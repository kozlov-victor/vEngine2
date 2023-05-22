import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class FeatureRecord {

    private readonly tag: number;
    private readonly offset: number;

    constructor(raf:RandomAccessFile) {
        this.tag = raf.readInt();
        this.offset = raf.readUnsignedShort();
    }

    public getTag() {
        return this.tag;
    }

    public getOffset() {
        return this.offset;
    }

}
