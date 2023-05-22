import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {GlyfDescript} from "@engine/misc/parsers/ttf/table/glyfDescript";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {ByteArrayInputStream} from "@engine/misc/parsers/ttf/byteArrayInputStream";
import {LocaTable} from "@engine/misc/parsers/ttf/table/locaTable";
import {GlyfCompositeDescript} from "@engine/misc/parsers/ttf/table/glyfCompositeDescript";
import {GlyfSimpleDescript} from "@engine/misc/parsers/ttf/table/glyfSimpleDescript";
import {toShort} from "@engine/misc/parsers/ttf/misc/toShort";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class GlyfTable implements Table {

    private buf:number[] ;
    private descript: GlyfDescript[];

    constructor(de:DirectoryEntry, raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.buf = new Array(de.length);
        raf.read(this.buf);
/*
        TableMaxp t_maxp = (TableMaxp) td.getEntryByTag(maxp).getTable();
        TableLoca t_loca = (TableLoca) td.getEntryByTag(loca).getTable();
        descript = new TableGlyfDescript[t_maxp.getNumGlyphs()];
        for (int i = 0; i < t_maxp.getNumGlyphs(); i++) {
            raf.seek(tde.getOffset() + t_loca.getOffset(i));
            int len = t_loca.getOffset((short)(i + 1)) - t_loca.getOffset(i);
            if (len > 0) {
                short numberOfContours = raf.readShort();
                if (numberOfContours < 0) {
                    //          descript[i] = new TableGlyfCompositeDescript(this, raf);
                } else {
                    descript[i] = new TableGlyfSimpleDescript(this, numberOfContours, raf);
                }
            } else {
                descript[i] = null;
            }
        }

        for (int i = 0; i < t_maxp.getNumGlyphs(); i++) {
            raf.seek(tde.getOffset() + t_loca.getOffset(i));
            int len = t_loca.getOffset((short)(i + 1)) - t_loca.getOffset(i);
            if (len > 0) {
                short numberOfContours = raf.readShort();
                if (numberOfContours < 0) {
                    descript[i] = new TableGlyfCompositeDescript(this, raf);
                }
            }
        }
*/
    }

    public init(numGlyphs: number, loca: LocaTable) {
        if (!this.buf) {
            return;
        }
        this.descript = new Array(numGlyphs);
        const bais = new ByteArrayInputStream(this.buf);
        for (let i = 0; i < numGlyphs; i++) {
            const len = loca.getOffset((i + 1)) - loca.getOffset(i);
            if (len > 0) {
                bais.reset();
                bais.skip(loca.getOffset(i));
                const numberOfContours = toShort((bais.read2()<<8) | bais.read2());
                if (numberOfContours >= 0) {
                    this.descript[i] = new GlyfSimpleDescript(this, numberOfContours, bais);
                } else {
                    this.descript[i] = new GlyfCompositeDescript(this, bais);
                }
            }
        }

        this.buf = null!;

        for (let i = 0; i < numGlyphs; i++) {
            if (!this.descript[i]) continue;

            this.descript[i].resolve();
        }
    }

    public getDescription(i: number) {
        return this.descript[i];
    }

    public getType() {
        return TableConsts.glyf;
    }
}
