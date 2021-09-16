import {ISize} from "@engine/geometry/size";
import {FontContextAbstractFactory} from "@engine/renderable/impl/general/font/factory/fontContextAbstractFactory";

interface IPrefixedContext {
    mozImageSmoothingEnabled?: boolean;
    webkitImageSmoothingEnabled?: boolean;
    msImageSmoothingEnabled?: boolean;
    oImageSmoothingEnabled?: boolean;
}

export class FontContextCanvasFactory extends FontContextAbstractFactory<CanvasRenderingContext2D> {

    private measureCanvas:CanvasRenderingContext2D;

    constructor(private strFont:string) {
        super();
        const el = document.createElement('canvas');
        this.measureCanvas = el.getContext('2d')!;
        this.measureCanvas.font = strFont;
    }

    protected getFontHeight(): number {
        const parent:HTMLSpanElement = document.createElement("span");
        parent.appendChild(document.createTextNode("height"));
        document.body.appendChild(parent);
        parent.style.cssText = `font: ${this.strFont}; white-space: nowrap; display: inline-block;line-height:1em;`;
        const height:number = parent.offsetHeight;
        document.body.removeChild(parent);
        return height;
    }

    protected getLetterWidth(letter: string): number {
        return ~~this.measureCanvas.measureText(letter).width;
    }

    protected createTexturePage(size: ISize): CanvasRenderingContext2D {
        const cnv:HTMLCanvasElement = document.createElement('canvas');
        cnv.width = size.width;
        cnv.height = size.height;
        const ctx:CanvasRenderingContext2D = cnv.getContext('2d')!;
        ctx.font = this.strFont;
        ctx.textBaseline = 'top';
        ctx.imageSmoothingEnabled = false;
        (ctx as IPrefixedContext).mozImageSmoothingEnabled = false;
        (ctx  as IPrefixedContext).webkitImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).msImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).oImageSmoothingEnabled = false;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0,0,cnv.width,cnv.height);
        ctx.fillStyle = '#fff';
        return ctx;
    }

    protected drawLetter(context: CanvasRenderingContext2D, letter: string, x: number, y: number): void {
        context.fillText(letter,x,y);
    }

}
