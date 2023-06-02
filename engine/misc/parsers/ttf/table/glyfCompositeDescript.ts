import {ByteArrayInputStream} from "@engine/misc/parsers/ttf/byteArrayInputStream";
import {GlyfCompositeComp} from "@engine/misc/parsers/ttf/table/glyfCompositeComp";
import {GlyfDescript} from "@engine/misc/parsers/ttf/table/glyfDescript";
import {GlyfTable} from "@engine/misc/parsers/ttf/table/glyfTable";
import {toShort} from "@engine/misc/parsers/ttf/misc/toShort";

export class GlyfCompositeDescript extends GlyfDescript {

    private components:GlyfCompositeComp[] = [];

    protected beingResolved = false;
    protected resolved      = false;

    public constructor(parentTable: GlyfTable, bais: ByteArrayInputStream) {
        super(parentTable, -1, bais);

        // Get all of the composite components
        let comp:GlyfCompositeComp;
        do {
            comp = new GlyfCompositeComp(bais);
            this.components.push(comp);
        } while ((comp.flags & GlyfCompositeComp.MORE_COMPONENTS) != 0);

        // Are there hinting intructions to read?
        if ((comp.flags & GlyfCompositeComp.WE_HAVE_INSTRUCTIONS) != 0) {
            this.readInstructions(bais, (bais.read2()<<8 | bais.read2()));
        }
    }

    public override resolve() {
        if (this.resolved) return;
        if (this.beingResolved) {
            console.error("Circular reference in GlyfCompositeDesc");
            return;
        }
        this.beingResolved = true;

        let firstIndex = 0;
        let firstContour = 0;

        for (const component of this.components) {
            component.firstIndex = firstIndex;
            component.firstContour = firstContour;

            const desc = this.parentTable.getDescription(component.glyphIndex);
            if (desc) {
                desc.resolve();
                firstIndex += desc.getPointCount();
                firstContour += desc.getContourCount();
            }
        }
        this.resolved = true;
        this.beingResolved = false;
    }

    public getEndPtOfContours(i: number) {
        const c = this.getCompositeCompEndPt(i);
        if (c) {
            const gd = this.parentTable.getDescription(c.glyphIndex);
            return gd.getEndPtOfContours(i - c.firstContour) + c.firstIndex;
        }
        return 0;
    }

    public getFlags(i:number) {
        const c = this.getCompositeComp(i);
        if (c) {
            const gd = this.parentTable.getDescription(c.glyphIndex);
            return gd.getFlags(i - c.firstIndex);
        }
        return 0;
    }

    public getXCoordinate(i: number) {
        const c = this.getCompositeComp(i);
        if (c) {
            const gd = this.parentTable.getDescription(c.glyphIndex);
            const n = i - c.firstIndex;
            const x = gd.getXCoordinate(n);
            const y = gd.getYCoordinate(n);
            let x1 = c.scaleX(x, y);
            x1 += c.xtranslate;
            return toShort(x1);
        }
        return 0;
    }

    public getYCoordinate(i: number) {
        const c = this.getCompositeComp(i);
        if (c) {
            const gd = this.parentTable.getDescription(c.glyphIndex);
            const n = i - c.firstIndex;
            const x = gd.getXCoordinate(n);
            const y = gd.getYCoordinate(n);
            let y1 = c.scaleY(x, y);
            y1 += c.ytranslate;
            return toShort(y1);
        }
        return 0;
    }

    public isComposite() {
        return true;
    }

    public getPointCount() {
        if (!this.resolved)
            console.error("getPointCount called on unresolved GlyfCompositeDescript");

        const c = this.components[this.components.length-1];
        // System.err.println("C: " + c + " Idx: " + c.getGlyphIndex());
        // System.err.println("Ptbl: " + parentTable);
        return c.firstIndex + this.parentTable.getDescription(c.glyphIndex).getPointCount();
    }

    public getContourCount() {
        if (!this.resolved)
            console.error("getContourCount called on unresolved GlyfCompositeDescript");

        const c = this.components[this.components.length-1];
        return c.firstContour + this.parentTable.getDescription(c.glyphIndex).getContourCount();
    }

    public getComponentIndex(i:number) {
        return this.components[i].firstIndex;
    }

    public getComponentCount() {
        return this.components.length;
    }

    protected getCompositeComp(i:number):GlyfCompositeComp {
        for (const c of this.components) {
            const gd = this.parentTable.getDescription(c.glyphIndex);
            if (c.firstIndex <= i && i < (c.firstIndex + gd.getPointCount())) {
                return c;
            }
        }
        return null!;
    }

    protected getCompositeCompEndPt(i: number):GlyfCompositeComp {
        for (const c of this.components) {
            const gd = this.parentTable.getDescription(c.glyphIndex);
            if (c.firstContour <= i && i < (c.firstContour + gd.getContourCount())) {
                return c;
            }
        }
        return null!;
    }
}
