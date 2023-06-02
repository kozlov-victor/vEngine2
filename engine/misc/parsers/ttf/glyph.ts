import {Point} from "@engine/misc/parsers/ttf/point";
import {GlyphDescription} from "@engine/misc/parsers/ttf/table/glyphDescription";
import {GlyfDescript} from "@engine/misc/parsers/ttf/table/glyfDescript";
import {toShort} from "@engine/misc/parsers/ttf/misc/toShort";

export class Glyph {

    public leftSideBearing: number;
    public advanceWidth: number;
    private points:Point[];

    public constructor(gd: GlyphDescription, lsb: number, advance: number) {
        this.leftSideBearing = lsb;
        this.advanceWidth = advance;
        this.describe(gd);
    }

    public getPoint(i:number):Point {
        return this.points[i];
    }

    public getPointCount() {
        return this.points.length;
    }

    /**
     * Resets the glyph to the TrueType table settings
     */
    public reset() {
    }

    /**
     * @param factor a 16.16 fixed value
     */
    public scale(factor: number): void {
        for (const point of this.points) {
            //points[i].x = ( points[i].x * factor ) >> 6;
            //points[i].y = ( points[i].y * factor ) >> 6;
            point.x = ((point.x << 10) * factor) >> 26;
            point.y = ((point.y << 10) * factor) >> 26;
        }
        this.leftSideBearing = toShort(( this.leftSideBearing * factor) >> 6);
        this.advanceWidth = (this.advanceWidth * factor) >> 6;
    }

    /**
     * Set the points of a glyph from the GlyphDescription
     */
    private describe(gd: GlyphDescription):void {
        let endPtIndex = 0;
        this.points = new Array(gd.getPointCount() + 2);
        for (let i = 0; i < gd.getPointCount(); i++) {
            const endPt = gd.getEndPtOfContours(endPtIndex) === i;
            if (endPt) {
                endPtIndex++;
            }
            this.points[i] =
                new Point(
                    gd.getXCoordinate(i),
                    gd.getYCoordinate(i),
                    (gd.getFlags(i) & GlyfDescript.onCurve) != 0,
                    endPt
                );
        }

        // Append the origin and advanceWidth points (n & n+1)
        this.points[gd.getPointCount()] = new Point(0, 0, true, true);
        this.points[gd.getPointCount()+1] = new Point(this.advanceWidth, 0, true, true);
    }
}
