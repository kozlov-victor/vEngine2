import {Game} from "@engine/core/game";
import {IRectJSON} from "@engine/geometry/rect";
import {Color} from "@engine/renderer/common/color";
import {IResource, IRevalidatable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ITexture} from "@engine/renderer/common/texture";
import {Document, Element, IDocumentDescription} from "@engine/misc/xmlUtils";

export interface IRectViewJSON extends IRectJSON {
    destOffsetX:number;
    destOffsetY:number;
}

export interface IFontContext {
    lineHeight: number;
    symbols: Record<string, IRectViewJSON>;
    width:number;
    height:number;
}


interface IPrefixedContext {
    mozImageSmoothingEnabled?: boolean;
    webkitImageSmoothingEnabled?: boolean;
    msImageSmoothingEnabled?: boolean;
    oImageSmoothingEnabled?: boolean;
}

const getCtx = (cnv:HTMLCanvasElement):CanvasRenderingContext2D=>{
    return cnv.getContext('2d') as CanvasRenderingContext2D;
};

export namespace FontFactory {

    const SYMBOL_PADDING:number = 4;

    const getFontHeight = (strFont:string):number=> {
        const parent:HTMLSpanElement = document.createElement("span");
        parent.appendChild(document.createTextNode("height!ДдЙЇ"));
        document.body.appendChild(parent);
        parent.style.cssText = `font: ${strFont}; white-space: nowrap; display: inline-block;`;
        const height:number = parent.offsetHeight;
        document.body.removeChild(parent);
        return height;
    };

    export const getFontContext = (standartChars:string[], extraChars:string[],strFont:string, w:number):IFontContext=> {

        const cnv:HTMLCanvasElement = document.createElement('canvas');
        const ctx:CanvasRenderingContext2D = getCtx(cnv);
        ctx.font = strFont;
        const lineHeight:number = getFontHeight(strFont) + 2 * SYMBOL_PADDING;
        const symbols:{[key:string]:IRectViewJSON} = {};
        let currX:number = 0, currY:number = 0, cnvHeight = lineHeight;

        const putCharOnContext = (char:string):void=>{
            const context2D:CanvasRenderingContext2D = cnv.getContext('2d') as CanvasRenderingContext2D;
            let textWidth:number = context2D.measureText(char).width;
            textWidth += 2 * SYMBOL_PADDING;
            if (textWidth === 0) return;
            if (currX + textWidth > w) {
                currX = 0;
                currY += lineHeight;
                cnvHeight = currY + lineHeight;
            }
            const symbolRect:IRectViewJSON = {} as IRectViewJSON;
            symbolRect.x = ~~currX + SYMBOL_PADDING;
            symbolRect.y = ~~currY + SYMBOL_PADDING;
            symbolRect.width = ~~textWidth - 2 * SYMBOL_PADDING;
            symbolRect.height = lineHeight - 2 * SYMBOL_PADDING;
            symbolRect.destOffsetX = symbolRect.destOffsetY = 0;
            symbols[char] = symbolRect;
            currX += textWidth;
        }

        standartChars.forEach(c=>putCharOnContext(c))
        extraChars.forEach(c=>putCharOnContext(c));
        return {symbols, width: w, height: cnvHeight,lineHeight:lineHeight - 2*SYMBOL_PADDING};
    };

    export const  getFontImageBase64 = (fontContext:IFontContext, strFont:string):string=> {
        const cnv:HTMLCanvasElement = document.createElement('canvas');
        cnv.width = fontContext.width;
        cnv.height = fontContext.height;
        const ctx:CanvasRenderingContext2D = getCtx(cnv);
        ctx.font = strFont;
        ctx.textBaseline = "top";
        ctx.imageSmoothingEnabled = false;
        (ctx as IPrefixedContext).mozImageSmoothingEnabled = false;
        (ctx  as IPrefixedContext).webkitImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).msImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).oImageSmoothingEnabled = false;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0,0,cnv.width,cnv.height);
        ctx.fillStyle = '#fff';
        const symbols:{[key:string]:IRectJSON} = fontContext.symbols;
        Object.keys(symbols).forEach((symbol:string)=>{
            const rect:IRectJSON = symbols[symbol];
            ctx.fillText(symbol, rect.x, rect.y);
        });
        return cnv.toDataURL();
    };

    export const createFontFromAtlas = (game:Game,resourceLink:ResourceLink<ITexture>,docDesc:IDocumentDescription):Font=>{

        const doc:Document = Document.create(docDesc);

        const context:IFontContext = {
            width: resourceLink.getTarget().size.width,
            height: resourceLink.getTarget().size.height,
            lineHeight: 0,
            symbols: {}
        };

        // http://www.angelcode.com/products/bmfont/doc/file_format.html
        const lineHeight:number = +(doc.querySelector('common').getAttribute('lineHeight'));
        const face:string = doc.querySelector('info').getAttribute('face');
        const all:Element[] = doc.querySelectorAll('char');
        for (let i:number=0;i<all.length;i++){
            const el:Element = all[i];
            const id:number = +(el.getAttribute('id'));
            const width:number = +(el.getAttribute('width')) || ~~(lineHeight / 3) || 16;
            const height:number = +(el.getAttribute('height')) || 0.0001;
            const x:number = +(el.getAttribute('x'));
            const y:number = +(el.getAttribute('y'));
            const xOffset:number = +(el.getAttribute('xoffset')) || 0;
            const yOffset:number = +(el.getAttribute('yoffset')) || 0;

            const char:string = String.fromCharCode(id);
            context.symbols[char] = {
                x,
                y,
                width,
                height,
                destOffsetX: xOffset,
                destOffsetY: yOffset
            };
            context.lineHeight = lineHeight;
        }
        return new Font(game,{fontFamily:face,fontSize:lineHeight,resourceLink,context});
    };

}

export interface IFontParameters {
    fontFamily: string;
    fontSize: number;
    extraChars:string[];
    resourceLink:ResourceLink<ITexture>;
    context:IFontContext;
}

const DEFAULT_FONT_PARAMS = {
    fontFamily: 'monospace',
    fontSize: 12,
    extraChars:[],
}

const LAT_CHARS:string =
    'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

const STANDART_SYMBOLS:string =
    '1234567890 ' +
    '"!`?\'.,;:()[]{}<>|/@\\^$-%+=#_&~*';


const CYR_CHARS:string =
    'АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНн' +
    'ОоПпРрСсТтУуФфХхЦцЧчШшЩщ' +
    'ЫыЬьЪъЭэЮюЯя'

export class Font implements IResource<ITexture> {

    public static async createSystemFont(game:Game):Promise<Font>{
        if (Font._systemFontInstance) return Font._systemFontInstance;
        const f:Font = new Font(game);
        f.createContext();
        const resourceLoader:ResourceLoader = new ResourceLoader(game);
        const link:ResourceLink<ITexture> = resourceLoader.loadTexture(f.createBitmap());
        f.setResourceLink(link);
        let resolveFn:(font:Font)=>void;
        resourceLoader.onCompleted(()=>{
            resolveFn(f);
            Font._systemFontInstance = f;
        });

        const p = new Promise<Font>(resolve=>{
            resolveFn = resolve;
        });
        resourceLoader.startLoading();
        return p;

    }

    private static _systemFontInstance:Font;

    public readonly type:string = 'Font';

    public readonly fontSize:number;
    public readonly extraChars:string[];
    public readonly fontFamily:string='Monospace';
    public readonly fontContext:Readonly<IFontContext>;

    private _resourceLink:ResourceLink<ITexture>;

    constructor(protected game:Game,params:Partial<IFontParameters> = {}) {
        this.fontFamily = params.fontFamily ?? DEFAULT_FONT_PARAMS.fontFamily;
        this.fontSize = params.fontSize ?? DEFAULT_FONT_PARAMS.fontSize;
        this.extraChars = params.extraChars ?? DEFAULT_FONT_PARAMS.extraChars;

        if (params.context===undefined) params.context = this.createContext();
        this.fontContext = params.context;

        if (params.resourceLink===undefined) {
            const base64:string = this.createBitmap();
            params.resourceLink = this.game.getCurrScene().resourceLoader.loadTexture(base64);
        }
        this.setResourceLink(params.resourceLink);

    }


    public asCss():string{
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    public setResourceLink(link:ResourceLink<ITexture>):void{
        this._resourceLink = link;
    }

    public getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

    private createContext():IFontContext {
        const WIDTH:number = 512;
        return FontFactory.getFontContext((LAT_CHARS+STANDART_SYMBOLS+CYR_CHARS).split(''),this.extraChars,this.asCss(),WIDTH);
    }

    private createBitmap():string{
        return FontFactory.getFontImageBase64(this.fontContext,this.asCss());
    }

}
