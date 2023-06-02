import {LookupSubtable} from "@engine/misc/parsers/ttf/table/lookupSubtable";
import {Coverage} from "@engine/misc/parsers/ttf/table/coverage";
import {LigatureSet} from "@engine/misc/parsers/ttf/table/ligatureSet";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export abstract class LigatureSubst extends LookupSubtable {

    public static read(raf: RandomAccessFile, offset: number):LigatureSubst {
        let ls:LigatureSubst = null!;
        raf.seek(offset);
        const format = raf.readUnsignedShort();
        if (format === 1) {
            ls = new LigatureSubstFormat1(raf, offset);
        }
        return ls;
    }

}

export class LigatureSubstFormat1 extends LigatureSubst {

    private coverageOffset: number;
    private ligSetCount: number;
    private ligatureSetOffsets: number[];
    private coverage: Coverage;
    private ligatureSets: LigatureSet[];

    constructor(raf: RandomAccessFile, offset: number) {
        super();
        this.coverageOffset = raf.readUnsignedShort();
        this.ligSetCount = raf.readUnsignedShort();
        this.ligatureSetOffsets = new Array(this.ligSetCount);
        this.ligatureSets = new Array(this.ligSetCount);
        for (let i = 0; i < this.ligSetCount; i++) {
            this.ligatureSetOffsets[i] = raf.readUnsignedShort();
        }
        raf.seek(offset + this.coverageOffset);
        this.coverage = Coverage.read(raf);
        for (let i = 0; i < this.ligSetCount; i++) {
            this.ligatureSets[i] = new LigatureSet(raf, offset + this.ligatureSetOffsets[i]);
        }
    }

    public getFormat() {
        return 1;
    }

}
