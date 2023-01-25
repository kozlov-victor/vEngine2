import {FontContextAbstractFactory} from "@engine/renderable/impl/general/font/factory/fontContextAbstractFactory";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {Game} from "@engine/core/game";
import {XmlDocument} from "@engine/misc/parsers/xml/xmlELements";
import {ISize} from "@engine/geometry/size";
import {ITexture} from "@engine/renderer/common/texture";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Optional} from "@engine/core/declarations";

const DEFAULT_SIZE = 10;
const PAD = 4;

// https://convertio.co/ttf-svg/

export class FontContextSvgFactory extends FontContextAbstractFactory<DrawingSurface> {

    private evenOddCompositionFilter = new EvenOddCompositionFilter(this.game);
    private readonly _fontHeight:number;
    private readonly scale:number;
    private _fontSize:number;

    constructor(game:Game, private fontDocument:XmlDocument,fontSize:number) {
        super(game);
        this._fontSize = fontSize;
        const polygons:Polygon[] = [];
        'Height!'.split('').forEach(c=>{
            const p = this.findLetterPolygons(c);
            if (p) polygons.push(...p);
        });
        const maxLetterHeight = Math.max(...polygons.map(it=>it.size.height));
        this.scale = 1/maxLetterHeight*fontSize;
        this._fontHeight = maxLetterHeight * this.scale + PAD;
        polygons.forEach(p => p.destroy());
    }

    public override createFont(standardChars: readonly string[], extraChars: readonly string[], fontFamily: string, fontSize: number): Font {
        const font = super.createFont(standardChars, extraChars, fontFamily, fontSize);
        this.evenOddCompositionFilter.destroy();
        return font;
    }

    public static hexEntityToStr(str:string = ''):string{
        if (str.indexOf('&#x')===0) {
            str = str.replace('&#x','');
            return String.fromCharCode(Number.parseInt(str,16));
        } else {
            return str;
        }
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
        const polygons = this.findLetterPolygons(letter);
        if (!polygons) return;
        polygons.forEach(p=>{
            p.scale.setXY(this.scale,-this.scale);
            p.pos.x = x;
            p.pos.y = y + this.getFontHeight() - PAD;
            p.fillColor = Color.BLACK;
            p.filters = [this.evenOddCompositionFilter];
            context.drawModel(p);
            p.destroy();
        });
    }

    protected override getFontHeight(): number {
        return this._fontHeight;
    }

    private findLetterPolygons(letter:string):Optional<Polygon[]> {
        const node = this.fontDocument.getElementsByTagName('glyph').find(it=>FontContextSvgFactory.hexEntityToStr(it.getAttribute('unicode'))===letter);
        if (!node) return undefined;
        const path = node.getAttribute('d');
        if (!path) return undefined;
        return Polygon.fromMultiCurveSvgPath(this.game,path);
    }

    protected override getLetterWidth(letter: string): number {
        const node = this.fontDocument.getElementsByTagName('glyph').find(it => FontContextSvgFactory.hexEntityToStr(it.getAttribute('unicode')) === letter);
        if (!node) return DEFAULT_SIZE;
        const path = node.getAttribute('d');
        if (!path) return DEFAULT_SIZE;
        const polygons = Polygon.fromMultiCurveSvgPath(this.game, path);
        if (!polygons.length) return DEFAULT_SIZE;
        const res = Math.max(DEFAULT_SIZE,...polygons.map(it=>it.size.width*this.scale));
        polygons.forEach(p => p.destroy());
        return res + PAD;
    }

    public override getFontSize():number {
        return this._fontSize;
    }

}
