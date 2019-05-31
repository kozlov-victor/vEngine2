import {Game} from "../../game";
import {IRectJSON} from "../../geometry/rect";
import {Color} from "@engine/renderer/color";
import {IResource, IRevalidatable} from "@engine/declarations";
import {DebugError} from "@engine/debug/debugError";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ITexture} from "@engine/renderer/texture";

export interface RectViewJSON extends IRectJSON {
    destOffsetX:number,
    destOffsetY:number
}

export interface FontContext {
    lineHeight: number,
    symbols: {[key:string]:RectViewJSON},
    width:number,
    height:number
}

interface Range {
    from:number,
    to:number
}

namespace FontFactory {

    const SYMBOL_PADDING:number = 4;

    const getFontHeight = (strFont:string):number=> {
        const parent:HTMLSpanElement = document.createElement("span");
        parent.appendChild(document.createTextNode("height!ДдЙЇ"));
        document.body.appendChild(parent);
        parent.style.cssText = `font: ${strFont}; white-space: nowrap; display: inline;`;
        const height:number = parent.offsetHeight;
        document.body.removeChild(parent);
        return height;
    };
    
    export const getFontContext = (arrFromTo:Range[], strFont:string, w:number):FontContext=> {
        
        const cnv:HTMLCanvasElement = document.createElement('canvas');
        const ctx:CanvasRenderingContext2D = cnv.getContext('2d');
        ctx.font = strFont;
        const lineHeight:number = getFontHeight(strFont) + 2 * SYMBOL_PADDING;
        const symbols:{[key:string]:RectViewJSON} = {};
        let currX:number = 0, currY:number = 0, cnvHeight = lineHeight;
        for (let k:number = 0; k < arrFromTo.length; k++) {
            let arrFromToCurr:Range = arrFromTo[k];
            for (let i:number = arrFromToCurr.from; i < arrFromToCurr.to; i++) {
                let currentChar:string = String.fromCharCode(i);
                let ctx:CanvasRenderingContext2D = cnv.getContext('2d');
                let textWidth:number = ctx.measureText(currentChar).width;
                textWidth += 2 * SYMBOL_PADDING;
                if (textWidth == 0) continue;
                if (currX + textWidth > w) {
                    currX = 0;
                    currY += lineHeight;
                    cnvHeight = currY + lineHeight;
                }
                const symbolRect:RectViewJSON = {} as RectViewJSON;
                symbolRect.x = ~~currX + SYMBOL_PADDING;
                symbolRect.y = ~~currY + SYMBOL_PADDING;
                symbolRect.width = ~~textWidth - 2 * SYMBOL_PADDING;
                symbolRect.height = lineHeight - 2 * SYMBOL_PADDING;
                symbolRect.destOffsetX = symbolRect.destOffsetY = 0;
                symbols[currentChar] = symbolRect;
                currX += textWidth;
            }
        }
        return {symbols: symbols, width: w, height: cnvHeight,lineHeight};
    };

    const correctColor = (canvas:HTMLCanvasElement,color:Color):void=>{
        const {r,g,b,a} = color.toJSON();
        const ctx:CanvasRenderingContext2D = canvas.getContext("2d");
        const imgData:ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const clamped:Uint8ClampedArray = imgData.data;
        for (let i:number = 0; i < clamped.length; i+=4) {
            const rIndex:number = i;
            const gIndex:number = i+1;
            const bIndex:number = i+2;
            const aIndex:number = i+3;
            const avg:number = (clamped[rIndex]+clamped[gIndex]+clamped[bIndex]+clamped[aIndex])/4;
            if (avg<0) {
                //clamped[aIndex] = 0;
            } else {
                clamped[rIndex] = r;
                clamped[gIndex] = g;
                clamped[bIndex] = b;
                clamped[aIndex] = ~~(clamped[aIndex]*a/255);
            }
        }
        ctx.putImageData(imgData, 0, 0);
    };

    export const  getFontImageBase64 = (fontContext:FontContext,strFont:string,color:Color):string=> {
        const cnv:HTMLCanvasElement = document.createElement('canvas');
        cnv.width = fontContext.width;
        cnv.height = fontContext.height;
        const ctx:CanvasRenderingContext2D = cnv.getContext('2d');
        ctx.font = strFont;
        ctx.textBaseline = "top";
        ctx.imageSmoothingEnabled = false;
        (ctx as any).mozImageSmoothingEnabled = false; // (obsolete)
        (ctx  as any).webkitImageSmoothingEnabled = false;
        (ctx as any).msImageSmoothingEnabled = false;
        (ctx as any).oImageSmoothingEnabled = false;
        ctx.fillStyle = '#00000000';
        ctx.fillRect(0,0,cnv.width,cnv.height);
        ctx.fillStyle = '#fff';
        const symbols:{[key:string]:IRectJSON} = fontContext.symbols;
        Object.keys(symbols).forEach((symbol:string)=>{
            const rect:IRectJSON = symbols[symbol];
            ctx.fillText(symbol, rect.x, rect.y);
        });
        correctColor(cnv,color);
        return cnv.toDataURL();
    };
    
}



export class Font implements IResource<ITexture>, IRevalidatable {

    readonly type:string = 'Font';
    fontSize:number=12;
    fontFamily:string='Monospace';
    fontContext:FontContext;
    fontColor:Color = Color.BLACK.clone();

    constructor(protected game:Game){}

    private static _systemFontInstance:Font;

    generate(){
        this.createContext();
        const base64:string = this.createBitmap();
        const link:ResourceLink<Texture> = this.game.getCurrScene().resourceLoader.loadImage(base64);
        this.setResourceLink(link);
    }

    static getSystemFont():Font{
        if (Font._systemFontInstance) return Font._systemFontInstance;
        const f:Font = new Font(Game.getInstance());
        f.createContext();
        const resourceLoader:ResourceLoader = new ResourceLoader(Game.getInstance());
        let link:ResourceLink<Texture> = resourceLoader.loadImage(f.createBitmap());
        resourceLoader.startLoading();
        f.setResourceLink(link);
        Font._systemFontInstance = f;
        return f;
    }

    asCss():string{
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    createContext():void {
        const ranges:Range[] = [{from: 32, to: 126}, {from: 1040, to: 1116}];
        const WIDTH:number = 512;
        this.fontContext = FontFactory.getFontContext(ranges,this.asCss(),WIDTH);
    }

    static fromAtlas(game:Game,link:ResourceLink<Texture>,fontContext:FontContext):Font{
        const fnt:Font = new Font(game);
        fnt.setResourceLink(link);
        fnt.fontContext = fontContext;
        return fnt;
    }

    createBitmap():string{
        return FontFactory.getFontImageBase64(this.fontContext,this.asCss(),this.fontColor);
    }

    revalidate():void {
        if (DEBUG) {
            if (!this.fontContext) throw new DebugError(`font context is not created. Did you invoke font.generate() method?`);
            if (!this.getResourceLink()) throw new DebugError(`font without resource link`);
        }
    }

    // resource
    private _resourceLink:ResourceLink<ITexture>;

    setResourceLink(link:ResourceLink<ITexture>):void{
        this._resourceLink = link;
    }

    getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

}