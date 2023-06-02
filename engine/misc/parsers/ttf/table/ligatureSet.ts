import {Ligature} from "@engine/misc/parsers/ttf/table/ligature";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export class LigatureSet {

    private readonly ligatureCount: number;
    private readonly ligatureOffsets: number[];
    private readonly ligatures:Ligature[];

    constructor(raf: RandomAccessFile,offset: number) {
        raf.seek(offset);
        this.ligatureCount = raf.readUnsignedShort();
        this.ligatureOffsets = new Array(this.ligatureCount);
        this.ligatures = new Array(this.ligatureCount);
        for (let i = 0; i < this.ligatureCount; i++) {
            this.ligatureOffsets[i] = raf.readUnsignedShort();
        }
        for (let i = 0; i < this.ligatureCount; i++) {
            raf.seek(offset + this.ligatureOffsets[i]);
            this.ligatures[i] = new Ligature(raf);
        }
    }

}

