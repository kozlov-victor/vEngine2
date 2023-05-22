import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {LookupSubtableFactory} from "@engine/misc/parsers/ttf/table/lookupSubtableFactory";
import {ScriptList} from "@engine/misc/parsers/ttf/table/scriptList";
import {FeatureList} from "@engine/misc/parsers/ttf/table/featureList";
import {LookupList} from "@engine/misc/parsers/ttf/table/lookupList";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {LookupSubtable} from "@engine/misc/parsers/ttf/table/lookupSubtable";
import {SingleSubst} from "@engine/misc/parsers/ttf/table/singleSubst";
import {LigatureSubst} from "@engine/misc/parsers/ttf/table/ligatureSubst";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class GsubTable implements Table, LookupSubtableFactory {

    public readonly scriptList: ScriptList;
    public readonly featureList: FeatureList;
    public readonly lookupList: LookupList;

    constructor(de: DirectoryEntry, raf: RandomAccessFile) {
        raf.seek(de.offset);

        // GSUB Header
        /* int version = */     raf.readInt();
        const scriptListOffset  = raf.readUnsignedShort();
        const featureListOffset = raf.readUnsignedShort();
        const lookupListOffset  = raf.readUnsignedShort();

        // Script List
        this.scriptList = new ScriptList(raf, de.offset + scriptListOffset);

        // Feature List
        this.featureList = new FeatureList(raf, de.offset + featureListOffset);

        // Lookup List
        this.lookupList = new LookupList(raf, de.offset + lookupListOffset, this);
    }

    /**
     * 1 - Single - Replace one glyph with one glyph
     * 2 - Multiple - Replace one glyph with more than one glyph
     * 3 - Alternate - Replace one glyph with one of many glyphs
     * 4 - Ligature - Replace multiple glyphs with one glyph
     * 5 - Context - Replace one or more glyphs in context
     * 6 - Chaining - Context Replace one or more glyphs in chained context
     */
    public read(type: number, raf: RandomAccessFile, offset: number):LookupSubtable {
        let s:LookupSubtable = null!;
        switch (type) {
        case 1:
            s = SingleSubst.read(raf, offset);
            break;
        case 2:
//            s = MultipleSubst.read(raf, offset);
            break;
        case 3:
//            s = AlternateSubst.read(raf, offset);
            break;
        case 4:
            s = LigatureSubst.read(raf, offset);
            break;
        case 5:
//            s = ContextSubst.read(raf, offset);
            break;
        case 6:
//            s = ChainingSubst.read(raf, offset);
            break;
        }
        return s;
    }

    /** Get the table type, as a table directory value.
     * @return The table type
     */
    public getType() {
        return TableConsts.GSUB;
    }

    public toString() {
        return "GSUB";
    }

}
