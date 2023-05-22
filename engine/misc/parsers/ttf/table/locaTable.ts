import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {ByteArrayInputStream} from "@engine/misc/parsers/ttf/byteArrayInputStream";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class LocaTable implements Table {

    private buf:number[];
    private offsets:number[];
    private factor = 0;

    constructor(de: DirectoryEntry, raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.buf = new Array(de.length);
        raf.read(this.buf);
    }

    public init(numGlyphs: number, shortEntries: boolean) {
        if (!this.buf) {
            return;
        }
        this.offsets = new Array(numGlyphs + 1);
        const bais = new ByteArrayInputStream(this.buf);
        if (shortEntries) {
            this.factor = 2;
            for (let i = 0; i <= numGlyphs; i++) {
                this.offsets[i] = (bais.read2()<<8) | bais.read2();
            }
        } else {
            this.factor = 1;
            for (let i = 0; i <= numGlyphs; i++) {
                this.offsets[i] = (bais.read2()<<24) | (bais.read2()<<16) |
                    (bais.read2()<<8) | bais.read2();
            }
        }
        this.buf = null!;
    }

    public getOffset(i: number) {
        if (!this.offsets) {
            return 0;
        }
        return this.offsets[i] * this.factor;
    }

    public getType() {
        return TableConsts.loca;
    }
}
