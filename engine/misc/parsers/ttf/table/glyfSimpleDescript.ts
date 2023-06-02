import {GlyfDescript} from "@engine/misc/parsers/ttf/table/glyfDescript";
import {GlyfTable} from "@engine/misc/parsers/ttf/table/glyfTable";
import {ByteArrayInputStream} from "@engine/misc/parsers/ttf/byteArrayInputStream";
import {toShort} from "@engine/misc/parsers/ttf/misc/toShort";

export class GlyfSimpleDescript extends GlyfDescript {

    private readonly endPtsOfContours:number[];
    private readonly flags:number[];
    private readonly xCoordinates: number[];
    private readonly yCoordinates: number[];
    private readonly count: number;

    constructor(parentTable: GlyfTable, numberOfContours: number, bais: ByteArrayInputStream) {

        super(parentTable, numberOfContours, bais);

        // Simple glyph description
        this.endPtsOfContours = new Array(numberOfContours);
        for (let i = 0; i < numberOfContours; i++) {
            this.endPtsOfContours[i] = (bais.read2()<<8) | bais.read2();
        }

        // The last end point index reveals the total number of points
        this.count = this.endPtsOfContours[numberOfContours-1] + 1;
        this.flags = new Array(this.count);
        this.xCoordinates = new Array(this.count);
        this.yCoordinates = new Array(this.count);

        const instructionCount = (bais.read2()<<8 | bais.read2());
        this.readInstructions(bais, instructionCount);
        this.readFlags(this.count, bais);
        this.readCoords(this.count, bais);
    }

    public getEndPtOfContours(i: number) {
        return this.endPtsOfContours[i];
    }

    public getFlags(i: number) {
        return this.flags[i];
    }

    public getXCoordinate( i: number) {
        return toShort(this.xCoordinates[i]);
    }

    public getYCoordinate(i: number) {
        return toShort(this.yCoordinates[i]);
    }

    public isComposite() {
        return false;
    }

    public getPointCount() {
        return this.count;
    }

    public getContourCount() {
        return this.getNumberOfContours();
    }
    /*
    public int getComponentIndex(int c) {
    return 0;
    }

    public int getComponentCount() {
    return 1;
    }
     */
    /**
     * The table is stored as relative values, but we'll store them as absolutes
     */
    private readCoords(count: number, bais: ByteArrayInputStream):void {
        let x = 0;
        let y = 0;
        for (let i = 0; i < count; i++) {
            if ((this.flags[i] & GlyfDescript.xDual) != 0) {
                if ((this.flags[i] & GlyfDescript.xShortVector) != 0) {
                    x += bais.read2();
                }
            } else {
                if ((this.flags[i] & GlyfDescript.xShortVector) != 0) {
                    x += -bais.read2();
                } else {
                    x += toShort((bais.read2()<<8) | bais.read2());
                }
            }
            this.xCoordinates[i] = x;
        }

        for (let i = 0; i < count; i++) {
            if ((this.flags[i] & GlyfDescript.yDual) != 0) {
                if ((this.flags[i] & GlyfDescript.yShortVector) != 0) {
                    y += bais.read2();
                }
            } else {
                if ((this.flags[i] & GlyfDescript.yShortVector) != 0) {
                    y +=  - bais.read2();
                } else {
                    y += (bais.read2()<<8) | bais.read2();
                }
            }
            this.yCoordinates[i] = y;
        }
    }

    /**
     * The flags are run-length encoded
     */
    private readFlags(flagCount: number, bais: ByteArrayInputStream):void {
        try {
            for (let index = 0; index < flagCount; index++) {
                this.flags[index] = bais.read2();
                if ((this.flags[index] & GlyfDescript.repeat) != 0) {
                    const repeats = bais.read2();
                    for (let i = 1; i <= repeats; i++) {
                        this.flags[index + i] = this.flags[index];
                    }
                    index += repeats;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}
