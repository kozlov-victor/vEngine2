

import {toInt} from "@engine/misc/parsers/ttf/misc/toInt";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export abstract class CmapFormat {

    protected format: number;
    protected length: number;
    protected version: number;

    protected constructor(raf:RandomAccessFile) {
        this.length = raf.readUnsignedShort();
        this.version = raf.readUnsignedShort();
    }

    public static create(format: number, raf:RandomAccessFile):CmapFormat {
        switch(format) {
            case 0:
                return new CmapFormat0(raf);
            case 2:
                return new CmapFormat2(raf);
            case 4:
                return new CmapFormat4(raf);
            case 6:
                return new CmapFormat6(raf);
        }
        return null!;
    }

    public getFormat() {
        return this.format;
    }

    public getLength() {
        return this.length;
    }

    public getVersion() {
        return this.version;
    }

    public abstract mapCharCode(charCode:number):number;

    public abstract getFirst():number;
    public abstract getLast():number;

}

export class CmapFormat0 extends CmapFormat {

    private readonly glyphIdArray = new Array(256);
    private readonly first: number;
    private readonly last: number;

    public constructor(raf:RandomAccessFile) {
        super(raf);
        this.format = 0;
        this.first = -1;
        for (let i = 0; i < 256; i++) {
            this.glyphIdArray[i] = raf.readUnsignedByte();
            if (this.glyphIdArray[i] > 0) {
                if (this.first == -1) this.first = i;
                this.last = i;
            }
        }
    }

    public getFirst() { return this.first; }
    public getLast()  { return this.last; }

    public mapCharCode(charCode:number):number {
        if (0 <= charCode && charCode < 256) {
            return this.glyphIdArray[charCode];
        } else {
            return 0;
        }
    }
}

export class CmapFormat2 extends CmapFormat {

    private subHeaderKeys = new Array<number>(256);
    private subHeaders1: number[];
    private subHeaders2:number[];
    private glyphIndexArray:number[];

    public  constructor(raf:RandomAccessFile) {
        super(raf);
        this.format = 2;
    }

    public getFirst():number { return 0; }
    public getLast():number  { return 0; }

    public mapCharCode(charCode:number):number {
        return 0;
    }
}

export class CmapFormat4 extends CmapFormat {

    public language: number;
    private readonly segCountX2: number;
    private searchRange: number;
    private entrySelector: number;
    private rangeShift: number;
    private readonly endCode: number[];
    private readonly startCode: number[];
    private readonly idDelta: number[];
    private readonly idRangeOffset: number[];
    private readonly glyphIdArray: number[];
    private readonly segCount: number;
    private readonly first: number;
    private readonly last: number;

    public constructor(raf:RandomAccessFile) {
        super(raf);
        this.format = 4;
        this.segCountX2 = raf.readUnsignedShort();
        this.segCount = toInt(this.segCountX2 / 2);
        this.endCode = new Array(this.segCount);
        this.startCode = new Array(this.segCount);
        this.idDelta = new Array(this.segCount);
        this.idRangeOffset = new Array(this.segCount);
        this.searchRange = raf.readUnsignedShort();
        this.entrySelector = raf.readUnsignedShort();
        this.rangeShift = raf.readUnsignedShort();
        this.last = -1;
        for (let i = 0; i < this.segCount; i++) {
            this.endCode[i] = raf.readUnsignedShort();
            if (this.endCode[i] > this.last) this.last = this.endCode[i];
        }
        raf.readUnsignedShort(); // reservePad
        for (let i = 0; i < this.segCount; i++) {
            this.startCode[i] = raf.readUnsignedShort();
            if ((i==0 ) || (this.startCode[i] < this.first)) this.first = this.startCode[i];
        }
        for (let i = 0; i < this.segCount; i++) {
            this.idDelta[i] = raf.readUnsignedShort();
        }
        for (let i = 0; i < this.segCount; i++) {
            this.idRangeOffset[i] = raf.readUnsignedShort();
        }

        // Whatever remains of this header belongs in glyphIdArray
        const count = toInt((this.length - 16 - (this.segCount*8)) / 2);
        this.glyphIdArray = new Array(count);
        for (let i = 0; i < count; i++) {
            this.glyphIdArray[i] = raf.readUnsignedShort();
        }
    }

    public getFirst():number { return this.first; }
    public getLast():number  { return this.last; }

    public mapCharCode(charCode: number): number {
        if ((charCode < 0) || (charCode >= 0xFFFE))
            return 0;

        for (let i = 0; i < this.segCount; i++) {
            if (this.endCode[i] >= charCode) {
                if (this.startCode[i] <= charCode) {
                    if (this.idRangeOffset[i] > 0) {
                        return this.glyphIdArray[this.idRangeOffset[i]/2 +
                        (charCode - this.startCode[i]) -
                        (this.segCount - i)];
                    } else {
                        return (this.idDelta[i] + charCode) % 65536;
                    }
                } else {
                    break;
                }
            }
        }
        return 0;
    }
}

export class CmapFormat6 extends CmapFormat {

    private firstCode: number;
    private entryCount: number;
    private glyphIdArray: number[];

    public constructor(raf:RandomAccessFile) {
        super(raf);
        this.format = 6;
    }

    public getFirst():number { return 0; }
    public getLast():number  { return 0; }

    public mapCharCode(charCode:number):number {
        return 0;
    }
}
