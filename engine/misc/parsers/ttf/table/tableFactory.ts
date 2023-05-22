import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {GposTable} from "@engine/misc/parsers/ttf/table/gposTable";
import {GsubTable} from "@engine/misc/parsers/ttf/table/gsubTable";
import {Os2Table} from "@engine/misc/parsers/ttf/table/os2Table";
import {CmapTable} from "@engine/misc/parsers/ttf/table/cmapTable";
import {CvtTable} from "@engine/misc/parsers/ttf/table/cvtTable";
import {FpgmTable} from "@engine/misc/parsers/ttf/table/fpgmTable";
import {GlyfTable} from "@engine/misc/parsers/ttf/table/glyfTable";
import {HeadTable} from "@engine/misc/parsers/ttf/table/headTable";
import {HheaTable} from "@engine/misc/parsers/ttf/table/hheaTable";
import {HmtxTable} from "@engine/misc/parsers/ttf/table/hmtxTable";
import {KernTable} from "@engine/misc/parsers/ttf/table/kernTable";
import {LocaTable} from "@engine/misc/parsers/ttf/table/locaTable";
import {MaxpTable} from "@engine/misc/parsers/ttf/table/maxpTable";
import {NameTable} from "@engine/misc/parsers/ttf/table/nameTable";
import {PrepTable} from "@engine/misc/parsers/ttf/table/prepTable";
import {PostTable} from "@engine/misc/parsers/ttf/table/postTable";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class TableFactory {

    public static create(de:DirectoryEntry, raf: RandomAccessFile):Table {
        let t:Table = null!;
        switch (de.tag) {
        case TableConsts.BASE:
            break;
        case TableConsts.CFF:
            break;
        case TableConsts.DSIG:
            break;
        case TableConsts.EBDT:
            break;
        case TableConsts.EBLC:
            break;
        case TableConsts.EBSC:
            break;
        case TableConsts.GDEF:
            break;
        case TableConsts.GPOS:
            t = new GposTable(de, raf);
            break;
        case TableConsts.GSUB:
            t = new GsubTable(de, raf);
            break;
        case TableConsts.JSTF:
            break;
        case TableConsts.LTSH:
            break;
        case TableConsts.MMFX:
            break;
        case TableConsts.MMSD:
            break;
        case TableConsts.OS_2:
            t = new Os2Table(de, raf);
            break;
        case TableConsts.PCLT:
            break;
        case TableConsts.VDMX:
            break;
        case TableConsts.cmap:
            t = new CmapTable(de, raf);
            break;
        case TableConsts.cvt:
            t = new CvtTable(de, raf);
            break;
        case TableConsts.fpgm:
            t = new FpgmTable(de, raf);
            break;
        case TableConsts.fvar:
            break;
        case TableConsts.gasp:
            break;
        case TableConsts.glyf:
            t = new GlyfTable(de, raf);
            break;
        case TableConsts.hdmx:
            break;
        case TableConsts.head:
            t = new HeadTable(de, raf);
            break;
        case TableConsts.hhea:
            t = new HheaTable(de, raf);
            break;
        case TableConsts.hmtx:
            t = new HmtxTable(de, raf);
            break;
        case TableConsts.kern:
            t = new KernTable(de, raf);
            break;
        case TableConsts.loca:
            t = new LocaTable(de, raf);
            break;
        case TableConsts.maxp:
            t = new MaxpTable(de, raf);
            break;
        case TableConsts.c_name:
            t = new NameTable(de, raf);
            break;
        case TableConsts.prep:
            t = new PrepTable(de, raf);
            break;
        case TableConsts.post:
            t = new PostTable(de, raf);
            break;
        case TableConsts.vhea:
            break;
        case TableConsts.vmtx:
            break;
        }
        return t;
    }
}
