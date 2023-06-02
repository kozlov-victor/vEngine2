import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {NameRecord} from "@engine/misc/parsers/ttf/table/nameRecord";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class NameTable implements Table {

    private formatSelector: number;
    private readonly numberOfNameRecords: number;
    private readonly stringStorageOffset: number;
    private readonly records: NameRecord[];

    constructor(de: DirectoryEntry,raf: RandomAccessFile) {
        raf.seek(de.offset);
        this.formatSelector = raf.readShort();
        this.numberOfNameRecords = raf.readShort();
        this.stringStorageOffset = raf.readShort();
        this.records = new Array(this.numberOfNameRecords);

        // Load the records, which contain the encoding information and string offsets
        for (let i = 0; i < this.numberOfNameRecords; i++) {
            this.records[i] = new NameRecord(raf);
        }

        // Now load the strings
        for (let i = 0; i < this.numberOfNameRecords; i++) {
            this.records[i].loadString(raf, de.offset + this.stringStorageOffset);
        }
    }

    public getRecord(nameId:number):string {

        // Search for the first instance of this name ID
        for (let i = 0; i < this.numberOfNameRecords; i++) {
            if (this.records[i].nameId === nameId) {
                return this.records[i].getRecordString();
            }
        }
        return "";
    }

    public getType() {
        return TableConsts.c_name;
    }
}
