import {Table, TableConsts} from "@engine/misc/parsers/ttf/table/table";
import {DirectoryEntry} from "@engine/misc/parsers/ttf/table/directoryEntry";
import {toInt} from "@engine/misc/parsers/ttf/misc/toInt";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class CvtTable implements Table {

    private readonly values: number[];

    constructor(de:DirectoryEntry,raf:RandomAccessFile)  {
        raf.seek(de.offset);
        const len = toInt(de.length / 2);
        this.values = new Array(len);
        for (let i = 0; i < len; i++) {
            this.values[i] = raf.readShort();
        }
    }

    public getType() {
        return TableConsts.cvt;
    }

    public getValues() {
        return this.values;
    }
}
