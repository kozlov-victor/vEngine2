import {Table} from "@engine/misc/parsers/ttf/table/table";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class DirectoryEntry {

    public tag: number;
    public checksum: number;
    public offset: number;
    public length: number;
    private table:Table;

    public constructor(raf:RandomAccessFile) {
        this.tag = raf.readInt();
        this.checksum = raf.readInt();
        this.offset = raf.readInt();
        this.length = raf.readInt();
    }


}
