import {ISize, Size} from "@engine/geometry/size";
import {FontContextAbstractFactory} from "@engine/renderable/impl/general/font/factory/fontContextAbstractFactory";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";

interface IPrefixedContext {
    mozImageSmoothingEnabled?: boolean;
    webkitImageSmoothingEnabled?: boolean;
    msImageSmoothingEnabled?: boolean;
    oImageSmoothingEnabled?: boolean;
}

const createCanvas = (size:ISize):HTMLCanvasElement=>{
    const c = document.createElement('canvas');
    c.width = size.width;
    c.height = size.height;
    return c;
}

export class FontContextCanvasFactory extends FontContextAbstractFactory<CanvasRenderingContext2D> {

    private measureCanvas:CanvasRenderingContext2D;

    constructor(game:Game,private strFont:string) {
        super(game);
        const el = createCanvas(new Size().setWH(512));
        this.measureCanvas = el.getContext('2d')!;
        this.measureCanvas.font = strFont;
    }

    protected override getFontHeight(): number {
        const parent = document.createElement("span");
        parent.appendChild(document.createTextNode("height!"));
        document.body.appendChild(parent);
        parent.style.cssText = `font: ${this.strFont}; white-space: nowrap; display: inline-block;line-height:1em;`;
        const height:number = parent.offsetHeight;
        document.body.removeChild(parent);
        return height;
    }

    protected override getLetterWidth(letter: string): number {
        return ~~this.measureCanvas.measureText(letter).width;
    }

    protected getAdvancedWidth(letter: string): number {
        return this.getLetterWidth(letter);
    }

    protected override texturePageToTexture(page: CanvasRenderingContext2D): ITexture {
        // const img = document.createElement('img');
        // img.src = page.canvas.toDataURL();
        // document.body.appendChild(img);
        return this.game.getRenderer().createTexture(page.canvas);
    }

    protected override createTexturePage(size: ISize): CanvasRenderingContext2D {
        const cnv = createCanvas(size);
        const ctx = cnv.getContext('2d')!;
        if (DEBUG && !ctx) {
            throw new DebugError(`can not get context 2d`);
        }
        ctx.font = this.strFont;
        ctx.textBaseline = 'top';
        ctx.imageSmoothingEnabled = false;
        (ctx as IPrefixedContext).mozImageSmoothingEnabled = false;
        (ctx  as IPrefixedContext).webkitImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).msImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).oImageSmoothingEnabled = false;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0,0,cnv.width,cnv.height);
        return ctx;
    }

    protected drawLetter(context: CanvasRenderingContext2D, letter: string, x: number, y: number): void {
        context.fillStyle = '#fff';
        context.fillText(letter,x,y);
    }

}
