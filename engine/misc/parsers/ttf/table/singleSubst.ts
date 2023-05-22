import {LookupSubtable} from "@engine/misc/parsers/ttf/table/lookupSubtable";
import {Coverage} from "@engine/misc/parsers/ttf/table/coverage";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export abstract class SingleSubst extends LookupSubtable {

    public abstract getFormat(): number;

    public abstract substitute(glyphId: number): number;

    public static read(raf: RandomAccessFile, offset: number):SingleSubst {
        let s:SingleSubst = null!;
        raf.seek(offset);
        const format = raf.readUnsignedShort();
        if (format === 1) {
            s = new SingleSubstFormat1(raf, offset);
        } else if (format == 2) {
            s = new SingleSubstFormat2(raf, offset);
        }
        return s;
    }

}

export class SingleSubstFormat1 extends SingleSubst {

    private readonly coverageOffset: number;
    private readonly deltaGlyphID: number;
    private coverage: Coverage;

    constructor(raf: RandomAccessFile, offset: number) {
        super();
        this.coverageOffset = raf.readUnsignedShort();
        this.deltaGlyphID = raf.readShort();
        raf.seek(offset + this.coverageOffset);
        this.coverage = Coverage.read(raf);
    }

    public getFormat() {
        return 1;
    }

    public substitute(glyphId:number):number {
        const i = this.coverage.findGlyph(glyphId);
        if (i > -1) {
            return glyphId + this.deltaGlyphID;
        }
        return glyphId;
    }

}

export class SingleSubstFormat2 extends SingleSubst {

    private coverageOffset: number;
    private glyphCount: number;
    private substitutes: number[];
    private coverage: Coverage;

    constructor(raf: RandomAccessFile, offset: number) {
        super();
        this.coverageOffset = raf.readUnsignedShort();
        this.glyphCount = raf.readUnsignedShort();
        this.substitutes = new Array(this.glyphCount);
        for (let i = 0; i < this.glyphCount; i++) {
            this.substitutes[i] = raf.readUnsignedShort();
        }
        raf.seek(offset + this.coverageOffset);
        this.coverage = Coverage.read(raf);
    }

    public getFormat() {
        return 2;
    }

    public substitute(glyphId: number): number {
        const i = this.coverage.findGlyph(glyphId);
        if (i > -1) {
            return this.substitutes[i];
        }
        return glyphId;
    }

}

