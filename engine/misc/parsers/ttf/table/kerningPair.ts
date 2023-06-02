import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class KerningPair {

    public readonly left: number;
    public readonly right: number;
    public readonly value: number;

    constructor(raf:RandomAccessFile) {
        this.left = raf.readUnsignedShort();
        this.right = raf.readUnsignedShort();
        this.value = raf.readShort();
    }

}
