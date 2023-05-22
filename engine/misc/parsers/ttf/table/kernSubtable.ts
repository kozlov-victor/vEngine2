import {KerningPair} from "@engine/misc/parsers/ttf/table/kerningPair";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";


export abstract class KernSubtable {


    public abstract getKerningPairCount(): number;

    public abstract getKerningPair(i: number):KerningPair;

    public static read(raf: RandomAccessFile):KernSubtable {
        let table:KernSubtable = null!;
        /* int version =*/ raf.readUnsignedShort();
        /* int length  =*/ raf.readUnsignedShort();
        const coverage   = raf.readUnsignedShort();
        const format     = coverage >> 8;

        switch (format) {
        case 0:
            table = new KernSubtableFormat0(raf);
            break;
        case 2:
            table = new KernSubtableFormat2(raf);
            break;
        default:
            break;
        }
        return table;
    }

}

export class KernSubtableFormat0 extends KernSubtable {

    private readonly nPairs: number;
    private searchRange: number;
    private entrySelector: number;
    private rangeShift: number;
    private readonly kerningPairs: KerningPair[];

    constructor(raf:RandomAccessFile) {
        super();
        this.nPairs = raf.readUnsignedShort();
        this.searchRange = raf.readUnsignedShort();
        this.entrySelector = raf.readUnsignedShort();
        this.rangeShift = raf.readUnsignedShort();
        this.kerningPairs = new Array(this.nPairs);
        for (let i = 0; i < this.nPairs; i++) {
            this.kerningPairs[i] = new KerningPair(raf);
        }
    }

    public getKerningPairCount() {
        return this.nPairs;
    }

    public getKerningPair(i: number) {
        return this.kerningPairs[i];
    }

}

export class KernSubtableFormat2 extends KernSubtable {

    private rowWidth: number;
    private leftClassTable: number;
    private rightClassTable: number;
    private array: number;

    constructor(raf:RandomAccessFile) {
        super();
        this.rowWidth = raf.readUnsignedShort();
        this.leftClassTable = raf.readUnsignedShort();
        this.rightClassTable = raf.readUnsignedShort();
        this.array = raf.readUnsignedShort();
    }

    public getKerningPairCount() {
        return 0;
    }

    public getKerningPair( i: number) {
        return null!;
    }

}
