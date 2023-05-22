import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {ByteArrayInputStream} from "@engine/misc/parsers/ttf/byteArrayInputStream";
import {toShort} from "@engine/misc/parsers/ttf/misc/toShort";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class HmtxTable implements Table {

    private buf: number[];
    private hMetrics: number[];
    private leftSideBearing: number[];

    constructor(de: DirectoryEntry,raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.buf = new Array(de.length);
        raf.read(this.buf);
/*
        TableMaxp t_maxp = (TableMaxp) td.getEntryByTag(maxp).getTable();
        TableHhea t_hhea = (TableHhea) td.getEntryByTag(hhea).getTable();
        int lsbCount = t_maxp.getNumGlyphs() - t_hhea.getNumberOfHMetrics();
        hMetrics = new int[t_hhea.getNumberOfHMetrics()];
        for (int i = 0; i < t_hhea.getNumberOfHMetrics(); i++) {
            hMetrics[i] = raf.readInt();
        }
        if (lsbCount > 0) {
            leftSideBearing = new short[lsbCount];
            for (int i = 0; i < lsbCount; i++) {
                leftSideBearing[i] = raf.readShort();
            }
        }
*/
    }

    public init(numberOfHMetrics:number, lsbCount: number) {
        if (!this.buf) {
            return;
        }
        this.hMetrics = new Array(numberOfHMetrics);
        const bais = new ByteArrayInputStream(this.buf);
        for (let i = 0; i < numberOfHMetrics; i++) {
            // pack 4 bytes from bais into an int and store in hMetrics[]
            // bais.read() returns an int 0..255, so no need to worry for sign-extension here
            this.hMetrics[i] = (bais.read2()<<24) | (bais.read2()<<16) |
                (bais.read2()<<8) | (bais.read2());
        }
        if (lsbCount > 0) {
            this.leftSideBearing = new Array(lsbCount);
            for (let i = 0; i < lsbCount; i++) {
                this.leftSideBearing[i] = toShort((bais.read2()<<8) | bais.read2());
            }
        }
        this.buf = null!;
    }

    public getAdvanceWidth(i:number) {
        if (!this.hMetrics) {
            return 0;
        }
        if (i < this.hMetrics.length) {
            return this.hMetrics[i] >> 16;
        } else {
            return this.hMetrics[this.hMetrics.length - 1] >> 16;
        }
    }

    public getLeftSideBearing(i: number) {
        if (!this.hMetrics) {
            return 0;
        }
        if (i < this.hMetrics.length) {
            return (this.hMetrics[i] & 0xffff);
        } else {
            return this.leftSideBearing![i - this.hMetrics.length];
        }
    }

    public getType() {
        return TableConsts.hmtx;
    }
}
