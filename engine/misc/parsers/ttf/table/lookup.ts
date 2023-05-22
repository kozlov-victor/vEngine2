import {LookupSubtable} from "@engine/misc/parsers/ttf/table/lookupSubtable";
import {LookupSubtableFactory} from "@engine/misc/parsers/ttf/table/lookupSubtableFactory";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class Lookup {

    // LookupFlag bit enumeration
    public static readonly IGNORE_BASE_GLYPHS = 0x0002;
    public static readonly IGNORE_BASE_LIGATURES = 0x0004;
    public static readonly IGNORE_BASE_MARKS = 0x0008;
    public static readonly MARK_ATTACHMENT_TYPE = 0xFF00;

    public readonly type: number;
    private readonly flag: number;
    public readonly subTableCount: number;
    private readonly subTableOffsets: number[];
    private readonly subTables: LookupSubtable[];

    constructor(factory: LookupSubtableFactory, raf: RandomAccessFile, offset: number) {
        raf.seek(offset);
        this.type = raf.readUnsignedShort();
        this.flag = raf.readUnsignedShort();
        this.subTableCount = raf.readUnsignedShort();
        this.subTableOffsets = new Array(this.subTableCount);
        this.subTables = new Array(this.subTableCount);
        for (let i = 0; i < this.subTableCount; i++) {
            this.subTableOffsets[i] = raf.readUnsignedShort();
        }
        for (let i = 0; i < this.subTableCount; i++) {
            this.subTables[i] = factory.read(this.type, raf, offset + this.subTableOffsets[i]);
        }
    }

    public getSubtable(i: number):LookupSubtable {
        return this.subTables[i];
    }

}

