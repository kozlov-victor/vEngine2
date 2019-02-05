



import {Game} from "../../core/game";
import {Rect} from "../../core/geometry/rect";
import {Resource} from "../../core/resources/resource";
import {Color} from "@engine/core/renderer/color";

interface FontContext {
    symbols: {[key:string]:Rect},
    width:number,
    height:number
}

interface Range {
    from:number,
    to:number
}

class FontFactory {

    static SYMBOL_PADDING:number = 4;

    private static getFontHeight(strFont:string):number {
        let parent = document.createElement("span");
        parent.appendChild(document.createTextNode("height!ДдЙЇ"));
        document.body.appendChild(parent);
        parent.style.cssText = "font: " + strFont + "; white-space: nowrap; display: inline;";
        let height = parent.offsetHeight;
        document.body.removeChild(parent);
        return height;
    }
    
    public static getFontContext(arrFromTo:Range[], strFont, w):FontContext {
        
        let cnv:HTMLCanvasElement = document.createElement('canvas');
        let ctx:CanvasRenderingContext2D = cnv.getContext('2d');
        ctx.font = strFont;
        let textHeight:number = FontFactory.getFontHeight(strFont) + 2 * FontFactory.SYMBOL_PADDING;
        let symbols = {};
        let currX:number = 0, currY:number = 0, cnvHeight = textHeight;
        for (let k:number = 0; k < arrFromTo.length; k++) {
            let arrFromToCurr = arrFromTo[k];
            for (let i:number = arrFromToCurr.from; i < arrFromToCurr.to; i++) {
                let currentChar = String.fromCharCode(i);
                ctx = cnv.getContext('2d');
                let textWidth:number = ctx.measureText(currentChar).width;
                textWidth += 2 * FontFactory.SYMBOL_PADDING;
                if (textWidth == 0) continue;
                if (currX + textWidth > w) {
                    currX = 0;
                    currY += textHeight;
                    cnvHeight = currY + textHeight;
                }
                let symbolRect:Rect = new Rect();
                symbolRect.x = ~~currX + FontFactory.SYMBOL_PADDING;
                symbolRect.y = ~~currY + FontFactory.SYMBOL_PADDING;
                symbolRect.width = ~~textWidth - 2 * FontFactory.SYMBOL_PADDING;
                symbolRect.height = textHeight - 2 * FontFactory.SYMBOL_PADDING;
                symbols[currentChar] = symbolRect;
                currX += textWidth;
            }
        }
        return {symbols: symbols, width: w, height: cnvHeight};
    }

    public static getFontImageBase64(fontContext:FontContext,strFont:string,color:Color):string {
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
    
}





export class Font extends Resource {

    type:string = 'Font';
    fontSize:number=12;
    fontFamily:string='Monospace';
    fontContext:FontContext=null;
    fontColor:Color = Color.BLACK.clone();

    constructor(protected game:Game){
        super();
    }

    asCss():string{
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    createContext(){
        const ranges:Range[] = [{from: 32, to: 150}, {from: 1040, to: 1116}];
        const WIDTH:number = 128;
        this.fontContext = FontFactory.getFontContext(ranges,this.asCss(),WIDTH);
    }

    createBitmap():string{
        return FontFactory.getFontImageBase64(this.fontContext,this.asCss(),this.fontColor);
    }

    // revalidate(){
    //     super.revalidate();
    //     let s = this.fontContext.symbols;
    //     this.fontContext.symbols = {};
    //     Object.keys(s).forEach((key:string)=>{
    //         if (DEBUG) {
    //             if (s[key]==undefined) {
    //                 console.error(s);
    //                 throw new DebugError(`font revalidation error: can not find proper object for key ${key}`);
    //             }
    //         }
    //         this.fontContext.symbols[key] = new Rect(s[key].x,s[key].y,s[key].width,s[key].height);
    //     });
    // }  // todo is it really need???

    getDefaultSymbolHeight():number{
        return this.fontContext.symbols[' '].height;
    }
}