import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export class Ligature {

    private ligGlyph: number;
    private compCount: number;
    private components: number[];

    constructor(raf: RandomAccessFile) {
        this.ligGlyph = raf.readUnsignedShort();
        this.compCount = raf.readUnsignedShort();
        this.components = new Array(this.compCount - 1);
        for (let i = 0; i < this.compCount - 1; i++) {
            this.components[i] = raf.readUnsignedShort();
        }
    }

    public getGlyphCount() {
        return this.compCount;
    }

    public getGlyphId(i:number):number {
        return (i == 0) ? this.ligGlyph : this.components[i-1];
    }

}
