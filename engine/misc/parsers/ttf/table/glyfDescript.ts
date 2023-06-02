import {Program} from "@engine/misc/parsers/ttf/table/program";
import {GlyphDescription} from "@engine/misc/parsers/ttf/table/glyphDescription";
import {GlyfTable} from "@engine/misc/parsers/ttf/table/glyfTable";
import {ByteArrayInputStream} from "@engine/misc/parsers/ttf/byteArrayInputStream";
import {toShort} from "@engine/misc/parsers/ttf/misc/toShort";

export abstract class GlyfDescript extends Program implements GlyphDescription {

    // flags
    public static readonly onCurve = 0x01;
    public static readonly xShortVector = 0x02;
    public static readonly yShortVector = 0x04;
    public static readonly repeat = 0x08;
    public static readonly xDual = 0x10;
    public static readonly yDual = 0x20;

    protected parentTable: GlyfTable;
    private readonly numberOfContours: number;
    private readonly xMin: number;
    private readonly yMin: number;
    private readonly xMax: number;
    private readonly yMax: number;

    protected constructor(parentTable:GlyfTable, numberOfContours: number, bais: ByteArrayInputStream) {
        super();
        this.parentTable = parentTable;
        this.numberOfContours = numberOfContours;
        this.xMin = toShort((bais.read2()<<8) | bais.read2());
        this.yMin = toShort((bais.read2()<<8) | bais.read2());
        this.xMax = toShort((bais.read2()<<8) | bais.read2());
        this.yMax = toShort((bais.read2()<<8) | bais.read2());
    }

    public resolve() {
    }

    public getNumberOfContours() {
        return this.numberOfContours;
    }

    public getXMaximum() {
        return this.xMax;
    }

    public getXMinimum() {
        return this.xMin;
    }

    public getYMaximum() {
        return this.yMax;
    }

    public getYMinimum() {
        return this.yMin;
    }

    public abstract getContourCount(): number;
    public abstract getEndPtOfContours(i: number): number;
    public abstract getFlags(i: number): number;
    public abstract getPointCount(): number;
    public abstract getXCoordinate(i: number):number;
    public abstract getYCoordinate(i: number): number;
    public abstract isComposite(): boolean;

}
