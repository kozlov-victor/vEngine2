import {Program} from "@engine/misc/parsers/ttf/table/program";
import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class PrepTable extends Program implements Table {

    constructor(de: DirectoryEntry,raf: RandomAccessFile) {
        super();
        raf.seek(de.offset);
        this.readInstructions(raf, de.length);
    }

    public getType() {
        return TableConsts.prep;
    }
}
