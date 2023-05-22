
import {RangeRecord} from "@engine/misc/parsers/ttf/table/rangeRecord";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export abstract class Coverage {

    public abstract getFormat(): number;

    /**
     * @param glyphId The ID of the glyph to find.
     * @return The index of the glyph within the coverage, or -1 if the glyph
     * can't be found.
     */
    public abstract findGlyph(glyphId: number):number;

    public static read(raf:RandomAccessFile):Coverage {
        let c:Coverage = null!;
        const format = raf.readUnsignedShort();
        if (format === 1) {
            c = new CoverageFormat1(raf);
        } else if (format === 2) {
            c = new CoverageFormat2(raf);
        }
        return c;
    }

}

export class CoverageFormat1 extends Coverage {

    private glyphCount: number;
    private glyphIds: number[];

    /** Creates new CoverageFormat1 */
    public constructor(raf:RandomAccessFile) {
        super();
        this.glyphCount = raf.readUnsignedShort();
        this.glyphIds = new Array<number>(this.glyphCount);
        for (let i = 0; i < this.glyphCount; i++) {
            this.glyphIds[i] = raf.readUnsignedShort();
        }
    }

    public getFormat():number {
        return 1;
    }

    public findGlyph(glyphId: number):number {
        for (let i = 0; i < this.glyphCount; i++) {
            if (this.glyphIds[i] == glyphId) {
                return i;
            }
        }
        return -1;
    }

}

export class CoverageFormat2 extends Coverage {

    private rangeCount: number;
    private rangeRecords:RangeRecord[];

    /** Creates new CoverageFormat2 */
    public constructor(raf:RandomAccessFile) {
        super();
        this.rangeCount = raf.readUnsignedShort();
        this.rangeRecords = new Array<RangeRecord>(this.rangeCount);
        for (let i = 0; i < this.rangeCount; i++) {
            this.rangeRecords[i] = new RangeRecord(raf);
        }
    }

    public getFormat():number {
        return 2;
    }

    public findGlyph(glyphId:number):number {
        for (let i = 0; i < this.rangeCount; i++) {
            const n = this.rangeRecords[i].getCoverageIndex(glyphId);
            if (n > -1) {
                return n;
            }
        }
        return -1;
    }

}
