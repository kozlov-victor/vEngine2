import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class CmapIndexEntry {

    public platformId: number;
    public encodingId: number;
    public offset: number;

    public constructor(raf:RandomAccessFile) {
        this.platformId = raf.readUnsignedShort();
        this.encodingId = raf.readUnsignedShort();
        this.offset = raf.readInt();
    }
}
