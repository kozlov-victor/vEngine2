import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class MaxpTable implements Table {

    public readonly versionNumber: number;
    public readonly numGlyphs: number;
    public readonly maxPoints: number;
    public readonly maxContours: number;
    public readonly maxCompositePoints: number;
    public readonly maxCompositeContours: number;
    public readonly maxZones: number;
    public readonly maxTwilightPoints: number;
    public readonly maxStorage: number;
    public readonly maxFunctionDefs: number;
    public readonly maxInstructionDefs: number;
    public readonly maxStackElements: number;
    public readonly maxSizeOfInstructions: number;
    public readonly maxComponentElements: number;
    public readonly maxComponentDepth: number;

    constructor(de: DirectoryEntry, raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.versionNumber = raf.readInt();
        this.numGlyphs = raf.readUnsignedShort();
        this.maxPoints = raf.readUnsignedShort();
        this.maxContours = raf.readUnsignedShort();
        this.maxCompositePoints = raf.readUnsignedShort();
        this.maxCompositeContours = raf.readUnsignedShort();
        this.maxZones = raf.readUnsignedShort();
        this.maxTwilightPoints = raf.readUnsignedShort();
        this.maxStorage = raf.readUnsignedShort();
        this.maxFunctionDefs = raf.readUnsignedShort();
        this.maxInstructionDefs = raf.readUnsignedShort();
        this.maxStackElements = raf.readUnsignedShort();
        this.maxSizeOfInstructions = raf.readUnsignedShort();
        this.maxComponentElements = raf.readUnsignedShort();
        this.maxComponentDepth = raf.readUnsignedShort();
    }

    public getType() {
        return TableConsts.maxp;
    }
}
