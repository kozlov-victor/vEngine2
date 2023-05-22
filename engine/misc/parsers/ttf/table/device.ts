
import {toInt} from "@engine/misc/parsers/ttf/misc/toInt";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class Device {

    private readonly startSize: number;
    private readonly endSize: number;
    private readonly deltaFormat: number;
    private readonly deltaValues: number[];

    constructor(raf:RandomAccessFile) {
        this.startSize = raf.readUnsignedShort();
        this.endSize = raf.readUnsignedShort();
        this.deltaFormat = raf.readUnsignedShort();
        let size = this.startSize - this.endSize;
        switch (this.deltaFormat) {
        case 1:
            size = (size % 8 == 0) ? size / 8 : size / 8 + 1;
            break;
        case 2:
            size = (size % 4 == 0) ? size / 4 : size / 4 + 1;
            break;
        case 3:
            size = (size % 2 == 0) ? size / 2 : size / 2 + 1;
            break;
        }
        size = toInt(size);
        this.deltaValues = new Array(size);
        for (let i = 0; i < size; i++) {
            this.deltaValues[i] = raf.readUnsignedShort();
        }
    }


}
