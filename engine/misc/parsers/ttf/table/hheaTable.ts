import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class HheaTable implements Table {

    public readonly version: number;
    public readonly ascender: number;
    public readonly descender: number;
    public readonly lineGap: number;
    public readonly advanceWidthMax: number;
    public readonly minLeftSideBearing: number;
    public readonly minRightSideBearing: number;
    public readonly xMaxExtent: number;
    public readonly caretSlopeRise: number;
    public readonly caretSlopeRun: number;
    public readonly metricDataFormat: number;
    public readonly numberOfHMetrics: number;

    constructor(de: DirectoryEntry,raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.version = raf.readInt();
        this.ascender = raf.readShort();
        this.descender = raf.readShort();
        this.lineGap = raf.readShort();
        this.advanceWidthMax = raf.readShort();
        this.minLeftSideBearing = raf.readShort();
        this.minRightSideBearing = raf.readShort();
        this.xMaxExtent = raf.readShort();
        this.caretSlopeRise = raf.readShort();
        this.caretSlopeRun = raf.readShort();
        for (let i = 0; i < 5; i++) {
            raf.readShort();
        }
        this.metricDataFormat = raf.readShort();
        this.numberOfHMetrics = raf.readUnsignedShort();
    }

    public getType() {
        return TableConsts.hhea;
    }
}
