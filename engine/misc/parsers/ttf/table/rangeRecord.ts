import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class RangeRecord {

    private start: number;
    private end: number;
    private startCoverageIndex: number;

    /** Creates new RangeRecord */
    public constructor(raf:RandomAccessFile) {
        this.start = raf.readUnsignedShort();
        this.end = raf.readUnsignedShort();
        this.startCoverageIndex = raf.readUnsignedShort();
    }

    public isInRange(glyphId:number):boolean {
        return (this.start <= glyphId && glyphId <= this.end);
    }

    public getCoverageIndex(glyphId:number):number {
        if (this.isInRange(glyphId)) {
            return this.startCoverageIndex + glyphId - this.start;
        }
        return -1;
    }

}

