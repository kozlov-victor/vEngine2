import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {KernSubtable} from "@engine/misc/parsers/ttf/table/kernSubtable";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class KernTable implements Table {

    private readonly version: number;
    private readonly nTables: number;
    private readonly tables: KernSubtable[];

    constructor(de: DirectoryEntry, raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.version = raf.readUnsignedShort();
        this.nTables = raf.readUnsignedShort();
        this.tables = new Array(this.nTables);
        for (let i = 0; i < this.nTables; i++) {
            this.tables[i] = KernSubtable.read(raf);
        }
    }

    public getSubtableCount() {
        return this.nTables;
    }

    public getSubtable(i: number) {
        return this.tables[i];
    }

    public getType() {
        return TableConsts.kern;
    }

}
