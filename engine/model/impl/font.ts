import {Game} from "../../game";
import {Rect} from "../../geometry/rect";
import {Resource} from "../../resources/resource";
import {Color} from "@engine/renderer/color";
import {Revalidatable} from "@engine/declarations";
import {DebugError} from "@engine/debug/debugError";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Scene} from "@engine/model/impl/scene";
import {ResourceLoader} from "@engine/resources/resourceLoader";

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
                symbolRect.point.x = ~~currX + SYMBOL_PADDING;
                symbolRect.point.y = ~~currY + SYMBOL_PADDING;
                symbolRect.size.width = ~~textWidth - 2 * SYMBOL_PADDING;
                symbolRect.size.height = textHeight - 2 * SYMBOL_PADDING;
                symbols[currentChar] = symbolRect;
                currX += textWidth;
            }
        }
        return {symbols: symbols, width: w, height: cnvHeight};
    };

    // const correctColor = (canvas:HTMLCanvasElement,color:Color):void=>{
    //     const {r,g,b,a} = color.toJSON();
    //     const ctx:CanvasRenderingContext2D = canvas.getContext("2d");
    //     const imgData:ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     const clamped:Uint8ClampedArray = imgData.data;
    //     for (let i:number = 0; i < clamped.length; i+=4) {
    //         const rIndex:number = i;
    //         const gIndex:number = i+1;
    //         const bIndex:number = i+2;
    //         const aIndex:number = i+3;
    //         const avg:number = (clamped[rIndex]+clamped[gIndex]+clamped[bIndex]+clamped[aIndex])/4;
    //         if (avg<110) {
    //             clamped[aIndex] = 0;
    //         } else {
    //             clamped[rIndex] = r;
    //             clamped[gIndex] = g;
    //             clamped[bIndex] = b;
    //         }
    //     }
    //     ctx.putImageData(imgData, 0, 0);
    // };

    export const  getFontImageBase64 = (fontContext:FontContext,strFont:string,color:Color):string=> {
        let cnv:HTMLCanvasElement = document.createElement('canvas');
        cnv.width = fontContext.width;
        cnv.height = fontContext.height;
        let ctx:CanvasRenderingContext2D = cnv.getContext('2d');
        ctx.font = strFont;
        ctx.textBaseline = "top";
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false; // (obsolete)
        ctx.webkitImageSmoothingEnabled = false;
        //ctx.msImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        ctx.fillStyle = '#00000000';
        ctx.fillRect(0,0,cnv.width,cnv.height);
        ctx.fillStyle = color.asCSS();
        let symbols:{[key:string]:Rect} = fontContext.symbols;
        Object.keys(symbols).forEach((symbol:string)=>{
            let rect:Rect = symbols[symbol];
            ctx.fillText(symbol, rect.point.x, rect.point.y);
        });
        //correctColor(cnv,color);
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
        return this.fontContext.symbols[' '].size.height;
    }
}