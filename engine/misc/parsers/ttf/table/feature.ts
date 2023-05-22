import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class Feature {

    private featureParams: number;
    private readonly lookupCount: number;
    private readonly lookupListIndex: number[];

    constructor(raf:RandomAccessFile, offset: number) {
        raf.seek(offset);
        this.featureParams = raf.readUnsignedShort();
        this.lookupCount = raf.readUnsignedShort();
        this.lookupListIndex = new Array(this.lookupCount);
        for (let i = 0; i < this.lookupCount; i++) {
            this.lookupListIndex[i] = raf.readUnsignedShort();
        }
    }

    public getLookupCount():number {
        return this.lookupCount;
    }

    public getLookupListIndex(i:number) {
        return this.lookupListIndex[i];
    }

}
