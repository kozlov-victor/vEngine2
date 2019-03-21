
import {Game} from "../../core/game";
import {Rect} from "../../core/geometry/rect";
import {Resource} from "../../core/resources/resource";
import {Color} from "@engine/core/renderer/color";
import {Revalidatable} from "@engine/declarations";
import {DebugError} from "@engine/debugError";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {Scene} from "@engine/model/impl/scene";
import {ResourceLoader} from "@engine/core/resources/resourceLoader";

interface FontContext {
    symbols: {[key:string]:Rect},
    width:number,
    height:number
}

interface Range {
    from:number,
    to:number
}

export namespace FontFactory {

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
        const textHeight:number = getFontHeight(strFont) + 2 * SYMBOL_PADDING;
        const symbols:{[key:string]:Rect} = {};
        let currX:number = 0, currY:number = 0, cnvHeight = textHeight;
        for (let k:number = 0; k < arrFromTo.length; k++) {
            let arrFromToCurr:Range = arrFromTo[k];
            for (let i:number = arrFromToCurr.from; i < arrFromToCurr.to; i++) {
                let currentChar = String.fromCharCode(i);
                let ctx = cnv.getContext('2d');
                let textWidth:number = ctx.measureText(currentChar).width;
                textWidth += 2 * SYMBOL_PADDING;
                if (textWidth == 0) continue;
                if (currX + textWidth > w) {
                    currX = 0;
                    currY += textHeight;
                    cnvHeight = currY + textHeight;
                }
                let symbolRect:Rect = new Rect();
                symbolRect.x = ~~currX + SYMBOL_PADDING;
                symbolRect.y = ~~currY + SYMBOL_PADDING;
                symbolRect.width = ~~textWidth - 2 * SYMBOL_PADDING;
                symbolRect.height = textHeight - 2 * SYMBOL_PADDING;
                symbols[currentChar] = symbolRect;
                currX += textWidth;
            }
        }
        return {symbols: symbols, width: w, height: cnvHeight};
    };

    export const  getFontImageBase64 = (fontContext:FontContext,strFont:string,color:Color):string=> {
        let cnv:HTMLCanvasElement = document.createElement('canvas');
        cnv.width = fontContext.width;
        cnv.height = fontContext.height;
        let ctx:CanvasRenderingContext2D = cnv.getContext('2d');
        ctx.font = strFont;
        ctx.fillStyle = color.asCSS();
        ctx.textBaseline = "top";
        let symbols:{[key:string]:Rect} = fontContext.symbols;
        Object.keys(symbols).forEach((symbol:string)=>{
            let rect:Rect = symbols[symbol];
            ctx.fillText(symbol, rect.x, rect.y);
        });
        return cnv.toDataURL();
    };

    export const generate = (f:Font,s:Scene):void=>{
        f.createContext();
        let link:ResourceLink = s.resourceLoader.loadImage(f.createBitmap());
        f.setResourceLink(link);
    }
    
}



export class Font extends Resource implements Revalidatable {

    readonly type:string = 'Font';
    fontSize:number=12;
    fontFamily:string='Monospace';
    fontContext:FontContext;
    fontColor:Color = Color.BLACK.clone();

    constructor(protected game:Game){
        super();
    }

    private static _systemFontInstance;

    static getSystemFont():Font{
        if (Font._systemFontInstance) return Font._systemFontInstance;
        const f:Font = new Font(Game.getInstance());
        f.createContext();
        const resourceLoader:ResourceLoader = new ResourceLoader(Game.getInstance());
        let link:ResourceLink = resourceLoader.loadImage(f.createBitmap());
        resourceLoader.startLoading();
        f.setResourceLink(link);
        Font._systemFontInstance = f;
        return f;
    }

    asCss():string{
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    createContext(){
        const ranges:Range[] = [{from: 32, to: 126}, {from: 1040, to: 1116}];
        const WIDTH:number = 512;
        this.fontContext = FontFactory.getFontContext(ranges,this.asCss(),WIDTH);
    }

    createBitmap():string{
        return FontFactory.getFontImageBase64(this.fontContext,this.asCss(),this.fontColor);
    }

    revalidate(){
        if (DEBUG) {
            if (!this.fontContext) throw new DebugError(`font context is not created`);
            if (!this.getResourceLink()) throw new DebugError(`font without resource link`);
        }
    }

    getDefaultSymbolHeight():number{
        return this.fontContext.symbols[' '].height;
    }
}