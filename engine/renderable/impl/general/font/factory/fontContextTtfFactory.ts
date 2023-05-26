import {FontContextAbstractFactory} from "@engine/renderable/impl/general/font/factory/fontContextAbstractFactory";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {ITexture} from "@engine/renderer/common/texture";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Optional} from "@engine/core/declarations";
import {ITtfFontData, TtfFont} from "@engine/misc/parsers/ttf/ttfFont";
import {
    CYR_CHARS,
    LAT_CHARS,
    STANDARD_SYMBOLS
} from "@engine/renderable/impl/general/font/createFontMethods/params/createFontParams";

// https://learn.microsoft.com/en-us/typography/opentype/spec/ttch01

const DEFAULT_SIZE = 10;

export class FontContextTtfFactory extends FontContextAbstractFactory<DrawingSurface> {

    private evenOddCompositionFilter = new EvenOddCompositionFilter(this.game);
    private readonly _fontHeight:number;
    private readonly scale:number;
    private readonly font: ITtfFontData;

    constructor(game:Game, private buff:ArrayBuffer,fontSize:number) {
        super(game);
        const symbols = (LAT_CHARS+STANDARD_SYMBOLS+CYR_CHARS).split('');
        this.font = TtfFont.parse(this.buff,symbols);
        console.log(this.font);
        if (this.font.glyphs.length===0) throw new Error(`no glyphs in font`);
        this.fontSize = fontSize;
        const maxLetterHeight = this.font.unitsPerEm;
        this.scale = 1/maxLetterHeight*fontSize;
        this._fontHeight = maxLetterHeight * this.scale;
    }

    public override createFont(_: readonly string[], __: readonly string[], ___: string, fontSize: number): Font {
        const chars = this.font.glyphs.map(it=>it.code);
        const font = super.createFont(chars, [], this.font.fontFamily, fontSize);
        this.font.kerning.forEach(kern=>{
            font.context.kerning[`${kern.left}${kern.right}`] = kern.value * this.scale;
        });
        this.evenOddCompositionFilter.destroy();
        return font;
    }

    protected override createTexturePage(size: ISize): DrawingSurface {
        const tx = new DrawingSurface(this.game,size);
        tx.setPixelPerfect(true);
        return tx;
    }

    protected override texturePageToTexture(page: DrawingSurface): ITexture {
        return page.getTexture();
    }

    protected override drawLetter(context: DrawingSurface, letter: string, x: number, y: number): void {
        const polygons =
            this.getLetterPolygons(letter) ??
            this.getLetterPolygons(this.font.glyphs[0].code);
        if (!polygons) return;
        polygons.forEach(p=>{
            p.scale.setXY(this.scale,-this.scale);
            p.pos.x = x;
            p.pos.y = y + this.getFontHeight() + this.font.descent*this.scale;
            p.fillColor = Color.BLACK;
            p.filters = [this.evenOddCompositionFilter];
            context.drawModel(p);
            p.destroy();
        });
    }

    protected override getFontHeight(): number {
        return this._fontHeight;
    }

    private getLetterPolygons(letter:string):Optional<Polygon[]> {
        const glyph = this.font.glyphs.find(it=>it.code===letter);
        if (!glyph) return undefined;
        const path = glyph.path;
        if (!path) return undefined;
        return Polygon.fromMultiCurveSvgPath(this.game,path);
    }

    protected override getLetterWidth(letter: string): number {
        const glyph = this.font.glyphs.find(it => it.code === letter);
        if (!glyph) return DEFAULT_SIZE;
        const path = glyph.path;
        if (!path) return DEFAULT_SIZE;
        const polygons = Polygon.fromMultiCurveSvgPath(this.game, path);
        if (!polygons.length) return DEFAULT_SIZE;
        const res = Math.max(DEFAULT_SIZE,...polygons.map(it=>it.size.width*this.scale));
        polygons.forEach(p => p.destroy());
        return res;
    }

    protected getAdvancedWidth(letter: string): number {
        const glyph = this.font.glyphs.find(it => it.code === letter);
        if (!glyph) return DEFAULT_SIZE;
        if (!glyph.width) return DEFAULT_SIZE;
        return glyph.width*this.scale;
    }

}
