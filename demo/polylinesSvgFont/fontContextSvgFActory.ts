import {FontContextAbstractFactory} from "@engine/renderable/impl/general/font/factory/fontContextAbstractFactory";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {Game} from "@engine/core/game";
import {XmlDocument} from "@engine/misc/xml/xmlELements";
import {ISize} from "@engine/geometry/size";
import {ITexture} from "@engine/renderer/common/texture";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font/font";

export class FontContextSvgFactory extends FontContextAbstractFactory<DrawingSurface> {

    private evenOddCompositionFilter = new EvenOddCompositionFilter(this.game);

    constructor(game:Game, private fontDocument:XmlDocument,private scale:number) {
        super(game);
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
        const node = this.fontDocument.getElementsByTagName('glyph').find(it=>FontContextSvgFactory.hexEntityToStr(it.getAttribute('unicode'))===letter);
        if (!node) return;
        const path = node.getAttribute('d');
        if (!path) return;
        const polygons = Polygon.fromMultiCurveSvgPath(this.game,path);
        if (!polygons.length) return;
        polygons.forEach(p=>{
            p.scale.setXY(this.scale,-this.scale);
            p.pos.x = x;
            p.pos.y = y + this.getFontHeight();
            p.fillColor = Color.BLACK;
            p.filters = [this.evenOddCompositionFilter];
            context.drawModel(p);
            p.destroy();
        });
    }

    protected override getFontHeight(): number {
        return 250*this.scale + 5;
    }

    protected override getLetterWidth(letter: string): number {
        const defaultWidth = 10;
        const node = this.fontDocument.getElementsByTagName('glyph').find(it => FontContextSvgFactory.hexEntityToStr(it.getAttribute('unicode')) === letter);
        if (!node) return defaultWidth;
        const path = node.getAttribute('d');
        if (!path) return defaultWidth;
        const polygons = Polygon.fromMultiCurveSvgPath(this.game, path);
        if (!polygons.length) return defaultWidth;
        const res = polygons[0].size.width*this.scale;
        polygons.forEach(p => p.destroy());
        return res;
    }

}
