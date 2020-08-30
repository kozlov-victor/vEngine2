import {Game} from "@engine/core/game";
import {IRectJSON} from "@engine/geometry/rect";
import {Color} from "@engine/renderer/common/color";
import {IResource, IRevalidatable} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ITexture} from "@engine/renderer/common/texture";

export interface IRectViewJSON extends IRectJSON {
    destOffsetX:number;
    destOffsetY:number;
}

export interface IFontContext {
    /**
     * @deprecated
     */
    lineHeight: number;
    symbols: Record<string, IRectViewJSON>;
    width:number;
    height:number;
}

interface IRange {
    from:number;
    to:number;
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

namespace FontFactory {

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

    export const getFontContext = (arrFromTo:IRange[], extraChars:string[],strFont:string, w:number):IFontContext=> {

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

        for (let k:number = 0; k < arrFromTo.length; k++) {
            const arrFromToCurr:IRange = arrFromTo[k];
            for (let i:number = arrFromToCurr.from; i < arrFromToCurr.to; i++) {
                putCharOnContext(String.fromCharCode(i));
            }
        }
        extraChars.forEach(c=>putCharOnContext(c));
        return {symbols, width: w, height: cnvHeight,lineHeight:lineHeight - 2*SYMBOL_PADDING};
    };

    export const  getFontImageBase64 = (fontContext:IFontContext, strFont:string, color:Color):string=> {
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

}



export class Font implements IResource<ITexture>, IRevalidatable {

    public static getSystemFont(game:Game):Font{
        if (Font._systemFontInstance) return Font._systemFontInstance;
        const f:Font = new Font(game);
        f.fontFamily = 'monospace';
        f.fontSize = 12;
        f.createContext();
        const resourceLoader:ResourceLoader = new ResourceLoader(game);
        const link:ResourceLink<ITexture> = resourceLoader.loadTexture(f.createBitmap());
        resourceLoader.startLoading();
        f.setResourceLink(link);
        Font._systemFontInstance = f;
        return f;
    }

    public static fromAtlas(game:Game,link:ResourceLink<ITexture>,fontContext:IFontContext):Font{
        const fnt:Font = new Font(game);
        fnt.setResourceLink(link);
        fnt.fontContext = fontContext;
        return fnt;
    }

    private static _systemFontInstance:Font;

    public readonly type:string = 'Font';

    public fontSize:number=12;
    public extraChars:string[] = [];
    public fontFamily:string='Monospace';
    public fontContext:Readonly<IFontContext>;
    /**
     * @deprecated
     */
    public fontColor:Color = Color.BLACK.clone();

    private _resourceLink:ResourceLink<ITexture>;

    constructor(protected game:Game){}

    public generate(){
        this.createContext();
        const base64:string = this.createBitmap();
        const link:ResourceLink<ITexture> = this.game.getCurrScene().resourceLoader.loadTexture(base64);
        this.setResourceLink(link);
    }

    public asCss():string{
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    public revalidate():void {
        if (DEBUG) {
            if (!this.fontContext) throw new DebugError(`font context is not created. Did you invoke font.generate() method?`);
            if (!this.getResourceLink()) throw new DebugError(`font without resource link`);
        }
    }

    public setResourceLink(link:ResourceLink<ITexture>):void{
        this._resourceLink = link;
    }

    public getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

    private createContext():void {
        const ranges:IRange[] = [{from: 32, to: 126}, {from: 1040, to: 1116}];
        const WIDTH:number = 512;
        this.fontContext = FontFactory.getFontContext(ranges,this.extraChars,this.asCss(),WIDTH);
    }

    private createBitmap():string{
        return FontFactory.getFontImageBase64(this.fontContext,this.asCss(),this.fontColor);
    }

}
