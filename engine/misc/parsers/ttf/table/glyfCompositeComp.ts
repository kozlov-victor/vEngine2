import {ByteArrayInputStream} from "@engine/misc/parsers/ttf/byteArrayInputStream";
import {toShort} from "@engine/misc/parsers/ttf/misc/toShort";

export class GlyfCompositeComp {

    public static readonly ARG_1_AND_2_ARE_WORDS = 0x0001;
    public static readonly ARGS_ARE_XY_VALUES = 0x0002;
    public static readonly ROUND_XY_TO_GRID = 0x0004;
    public static readonly WE_HAVE_A_SCALE = 0x0008;
    public static readonly MORE_COMPONENTS = 0x0020;
    public static readonly WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;
    public static readonly WE_HAVE_A_TWO_BY_TWO = 0x0080;
    public static readonly WE_HAVE_INSTRUCTIONS = 0x0100;
    public static readonly USE_MY_METRICS = 0x0200;

    public firstIndex:number;
    public firstContour:number;
    public argument1: number;
    public argument2: number;
    public flags: number;
    public glyphIndex: number;
    public xscale = 1.0;
    public yscale = 1.0;
    public scale01 = 0.0;
    public scale10 = 0.0;
    public xtranslate = 0;
    public ytranslate = 0;
    public point1 = 0;
    public point2 = 0;

    constructor(bais:ByteArrayInputStream) {
        this.flags      =        toShort((bais.read2()<<8) | bais.read2());
        this.glyphIndex =        ((bais.read2()<<8) | bais.read2());

        // Get the arguments as just their raw values
        if ((this.flags & GlyfCompositeComp.ARG_1_AND_2_ARE_WORDS) != 0) {
            this.argument1 = toShort((bais.read2()<<8) | bais.read2());
            this.argument2 = toShort((bais.read2()<<8) | bais.read2());
        } else {
            this.argument1 = toShort(bais.read2());
            this.argument2 = toShort(bais.read2());
        }

        // Assign the arguments according to the flags
        if ((this.flags & GlyfCompositeComp.ARGS_ARE_XY_VALUES) != 0) {
            this.xtranslate = this.argument1;
            this.ytranslate = this.argument2;
        } else {
            this.point1 = this.argument1;
            this.point2 = this.argument2;
        }

        // Get the scale values (if any)
        if ((this.flags & GlyfCompositeComp.WE_HAVE_A_SCALE) != 0) {
            const i = toShort((bais.read2()<<8) | bais.read2());
            this.xscale = this.yscale = i / 0x4000;
        } else if ((this.flags & GlyfCompositeComp.WE_HAVE_AN_X_AND_Y_SCALE) != 0) {
            let i = toShort((bais.read2()<<8) | bais.read2());
            this.xscale = i / 0x4000;
            i = toShort((bais.read2()<<8) | bais.read2());
            this.yscale = i / 0x4000;
        } else if ((this.flags & GlyfCompositeComp.WE_HAVE_A_TWO_BY_TWO) != 0) {
            let i = toShort((bais.read2()<<8) | bais.read2());
            this.xscale = i / 0x4000;
            i = toShort((bais.read2()<<8) | bais.read2());
            this.scale01 = i / 0x4000;
            i = toShort((bais.read2()<<8) | bais.read2());
            this.scale10 = i / 0x4000;
            i = toShort((bais.read2()<<8) | bais.read2());
            this.yscale = i / 0x4000;
        }
    }
    /**
     * Transforms an x-coordinate of a point for this component.
     * @param x The x-coordinate of the point to transform
     * @param y The y-coordinate of the point to transform
     * @return The transformed x-coordinate
     */
    public scaleX(x:number, y:number) {
        return Math.round((x * this.xscale + y * this.scale10));
    }

    /**
     * Transforms a y-coordinate of a point for this component.
     * @param x The x-coordinate of the point to transform
     * @param y The y-coordinate of the point to transform
     * @return The transformed y-coordinate
     */
    public scaleY(x:number, y:number) {
        return Math.round((x * this.scale01 + y * this.yscale));
    }
}
