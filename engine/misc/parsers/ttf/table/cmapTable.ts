import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {CmapIndexEntry} from "@engine/misc/parsers/ttf/table/cmapIndexEntry";
import {CmapFormat} from "@engine/misc/parsers/ttf/table/cmapFormat";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class CmapTable implements Table {

    private version: number;
    private readonly numTables: number;
    private readonly entries: CmapIndexEntry[];
    private readonly formats: CmapFormat[];

    public constructor(de: DirectoryEntry, raf: RandomAccessFile) {
        raf.seek(de.offset);
        const fp = raf.getFilePointer();
        this.version = raf.readUnsignedShort();
        this.numTables = raf.readUnsignedShort();
        this.entries = new Array<CmapIndexEntry>(this.numTables);
        this.formats = new Array<CmapFormat>(this.numTables);

        // Get each of the index entries
        for (let i = 0; i < this.numTables; i++) {
            this.entries[i] = new CmapIndexEntry(raf);
        }

        // Get each of the tables
        for (let i = 0; i < this.numTables; i++) {
            raf.seek(fp + this.entries[i].offset);
            const format = raf.readUnsignedShort();
            this.formats[i] = CmapFormat.create(format, raf);
        }
    }

    public getCmapFormat(platformId: number, encodingId: number):CmapFormat {

        // Find the requested format
        for (let i = 0; i < this.numTables; i++) {
            if (this.entries[i].platformId == platformId
                    && this.entries[i].encodingId === encodingId) {
                return this.formats[i];
            }
        }
        return null!;
    }

    public getType():number {
        return TableConsts.cmap;
    }
}
