
import {RangeRecord} from "@engine/misc/parsers/ttf/table/rangeRecord";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export abstract class ClassDef {

    public abstract getFormat():number;

    protected static read(raf:RandomAccessFile):ClassDef {
        const format = raf.readUnsignedShort();
        if (format === 1) {
            return new ClassDefFormat1(raf);
        } else if (format == 2) {
            return new ClassDefFormat2(raf);
        }
        throw new Error(`unexpected format: ${format}`);
    }
}

export class ClassDefFormat1 extends ClassDef {

    private startGlyph: number;
    private readonly glyphCount: number;
    private readonly classValues:number[];

    /** Creates new ClassDefFormat1 */
    public constructor(raf:RandomAccessFile) {
        super();
        this.startGlyph = raf.readUnsignedShort();
        this.glyphCount = raf.readUnsignedShort();
        this.classValues = new Array<number>(this.glyphCount);
        for (let i = 0; i < this.glyphCount; i++) {
            this.classValues[i] = raf.readUnsignedShort();
        }
    }

    public getFormat():number {
        return 1;
    }

}

export class ClassDefFormat2 extends ClassDef {

    private readonly classRangeCount: number;
    private readonly classRangeRecords:RangeRecord[];

    /** Creates new ClassDefFormat2 */
    public constructor(raf:RandomAccessFile) {
        super();
        this.classRangeCount = raf.readUnsignedShort();
        this.classRangeRecords = new Array<RangeRecord>(this.classRangeCount);
        for (let i = 0; i < this.classRangeCount; i++) {
            this.classRangeRecords[i] = new RangeRecord(raf);
        }
    }

    public getFormat():number {
        return 2;
    }

}
