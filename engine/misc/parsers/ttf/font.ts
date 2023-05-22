import {TableDirectory} from "@engine/misc/parsers/ttf/table/tableDirectory";
import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {Os2Table} from "@engine/misc/parsers/ttf/table/os2Table";
import {CmapTable} from "@engine/misc/parsers/ttf/table/cmapTable";
import {GlyfTable} from "@engine/misc/parsers/ttf/table/glyfTable";
import {HeadTable} from "@engine/misc/parsers/ttf/table/headTable";
import {HheaTable} from "@engine/misc/parsers/ttf/table/hheaTable";
import {HmtxTable} from "@engine/misc/parsers/ttf/table/hmtxTable";
import {LocaTable} from "@engine/misc/parsers/ttf/table/locaTable";
import {MaxpTable} from "@engine/misc/parsers/ttf/table/maxpTable";
import {NameTable} from "@engine/misc/parsers/ttf/table/nameTable";
import {PostTable} from "@engine/misc/parsers/ttf/table/postTable";
import {TableFactory} from "@engine/misc/parsers/ttf/table/tableFactory";
import {Glyph} from "@engine/misc/parsers/ttf/glyph";
import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class Font {

    private path: string;
//    private Interpreter interp = null;
//    private Parser parser = null;
    private tableDirectory:TableDirectory = null!;
    private tables: Table[];
    private os2: Os2Table;
    private cmap: CmapTable;
    private glyf: GlyfTable;
    private head: HeadTable;
    private hhea: HheaTable;
    private hmtx: HmtxTable;
    private loca: LocaTable;
    private maxp: MaxpTable;
    private name: NameTable;
    private post: PostTable;

    public getTable<T extends Table>(tableType: number):T {
        for (const table of this.tables) {
            if ((table) && (table.getType() == tableType)) {
                return table as T;
            }
        }
        return null!;
    }

    public getOS2Table() {
        return this.os2;
    }

    public getCmapTable() {
        return this.cmap;
    }

    public getHeadTable() {
        return this.head;
    }

    public getHheaTable() {
        return this.hhea;
    }

    public getHmtxTable() {
        return this.hmtx;
    }

    public getLocaTable() {
        return this.loca;
    }

    public getMaxpTable() {
        return this.maxp;
    }

    public getNameTable() {
        return this.name;
    }

    public getPostTable() {
        return this.post;
    }

    public getAscent() {
        return this.hhea.ascender;
    }

    public getDescent() {
        return this.hhea.descender;
    }

    public getNumGlyphs() {
        return this.maxp.numGlyphs;
    }

    public getGlyph(i: number): Glyph {
        return (this.glyf.getDescription(i))
            ? new Glyph(
                this.glyf.getDescription(i),
                this.hmtx.getLeftSideBearing(i),
                this.hmtx.getAdvanceWidth(i))
            : null!;
    }

    public getPath() {
        return this.path;
    }

    public getTableDirectory() {
        return this.tableDirectory;
    }

    private read(buff:ArrayBuffer):void {
        const binBuff = new BinBuffer(buff);
        const raf = new RandomAccessFile(binBuff);
        this.tableDirectory = new TableDirectory(raf);
        this.tables = new Array(this.tableDirectory.numTables);

        // Load each of the tables
        for (let i = 0; i < this.tableDirectory.numTables; i++) {
            this.tables[i] = TableFactory.create(this.tableDirectory.getEntry(i), raf);
        }

        // Get references to commonly used tables
        this.os2  = this.getTable(TableConsts.OS_2);
        this.cmap = this.getTable(TableConsts.cmap);
        this.glyf = this.getTable(TableConsts.glyf);
        this.head = this.getTable(TableConsts.head);
        this.hhea = this.getTable(TableConsts.hhea);
        this.hmtx = this.getTable(TableConsts.hmtx);
        this.loca = this.getTable(TableConsts.loca);
        this.maxp = this.getTable(TableConsts.maxp);
        this.name = this.getTable(TableConsts.c_name);
        this.post = this.getTable(TableConsts.post);

        // Initialize the tables that require it
        this.hmtx.init(this.hhea.numberOfHMetrics,
            this.maxp.numGlyphs - this.hhea.numberOfHMetrics);
        this.loca.init(this.maxp.numGlyphs, this.head.indexToLocFormat === 0);
        this.glyf.init(this.maxp.numGlyphs, this.loca);
    }


    public static create(buff:ArrayBuffer) {
        const f = new Font();
        f.read(buff);
        return f;
    }
}
