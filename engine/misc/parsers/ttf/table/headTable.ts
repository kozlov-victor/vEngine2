import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class HeadTable implements Table {

    public readonly versionNumber: number;
    public readonly fontRevision: number;
    public readonly checkSumAdjustment: number;
    public readonly magicNumber: number;
    public readonly flags: number;
    public readonly unitsPerEm: number;
    public readonly created: bigint;
    public readonly modified: bigint;
    public readonly xMin: number;
    public readonly yMin: number;
    public readonly xMax: number;
    public readonly yMax: number;
    public readonly macStyle: number;
    public readonly lowestRecPPEM: number;
    public readonly fontDirectionHint: number;
    public readonly indexToLocFormat: number;
    public readonly glyphDataFormat: number;

    constructor(de: DirectoryEntry,raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.versionNumber = raf.readInt();
        this.fontRevision = raf.readInt();
        this.checkSumAdjustment = raf.readInt();
        this.magicNumber = raf.readInt();
        this.flags = raf.readShort();
        this.unitsPerEm = raf.readShort();
        this.created = raf.readLong();
        this.modified = raf.readLong();
        this.xMin = raf.readShort();
        this.yMin = raf.readShort();
        this.xMax = raf.readShort();
        this.yMax = raf.readShort();
        this.macStyle = raf.readShort();
        this.lowestRecPPEM = raf.readShort();
        this.fontDirectionHint = raf.readShort();
        this.indexToLocFormat = raf.readShort();
        this.glyphDataFormat = raf.readShort();
    }

    public getType() {
        return TableConsts.head;
    }

}
