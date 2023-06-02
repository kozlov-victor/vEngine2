import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class TableDirectory {

    public readonly version:number;
    public readonly numTables:number;
    public readonly searchRange:number;
    public readonly entrySelector:number;
    public readonly rangeShift:number;
    public readonly entries:DirectoryEntry[];

    constructor(raf:RandomAccessFile) {
        this.version = raf.readInt();
        this.numTables = raf.readShort();
        this.searchRange = raf.readShort();
        this.entrySelector = raf.readShort();
        this.rangeShift = raf.readShort();
        this.entries = new Array(this.numTables);
        for (let i = 0; i < this.numTables; i++) {
            this.entries[i] = new DirectoryEntry(raf);
        }

        // Sort them into file order (simple bubble sort)
        let modified = true;
        while (modified) {
            modified = false;
            for (let i = 0; i < this.numTables - 1; i++) {
                if (this.entries[i].offset > this.entries[i+1].offset) {
                    const temp = this.entries[i];
                    this.entries[i] = this.entries[i+1];
                    this.entries[i+1] = temp;
                    modified = true;
                }
            }
        }
    }

    public getEntry(index: number) {
        return this.entries[index];
    }

    public getEntryByTag(tag: number) {
        for (let i = 0; i < this.numTables; i++) {
            if (this.entries[i].tag == tag) {
                return this.entries[i];
            }
        }
        return null;
    }
}
