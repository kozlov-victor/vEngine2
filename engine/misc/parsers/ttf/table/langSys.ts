import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class LangSys {

    private lookupOrder: number;
    private reqFeatureIndex: number;
    private featureCount: number;
    private featureIndex: number[];

    /** Creates new LangSys */
    constructor(raf:RandomAccessFile) {
        this.lookupOrder = raf.readUnsignedShort();
        this.reqFeatureIndex = raf.readUnsignedShort();
        this.featureCount = raf.readUnsignedShort();
        this.featureIndex = new Array(this.featureCount);
        for (let i = 0; i < this.featureCount; i++) {
            this.featureIndex[i] = raf.readUnsignedShort();
        }
    }

    public isFeatureIndexed(n: number) {
        for (let i = 0; i < this.featureCount; i++) {
            if (this.featureIndex[i] === n) {
                return true;
            }
        }
        return false;
    }

}

