import {ISize} from "@engine/geometry/size";
import {IRectJSON} from "@engine/geometry/rect";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import IFontSymbolInfo = FontTypes.IFontSymbolInfo;
import IPartialFontContext = FontTypes.IPartialFontContext;

export abstract class FontContextAbstractFactory<T> {

    private readonly SYMBOL_PADDING = 4 as const;
    private readonly MAX_HEIGHT = 512 as const;
    private readonly WIDTH:number = 512 as const;


    protected abstract getLetterWidth(letter:string):number;
    protected abstract getFontHeight():number;
    protected abstract createTexturePage(size:ISize):T;
    protected abstract drawLetter(context:T,letter:string,x:number,y:number):void;

    private partialContext:IPartialFontContext;
    private readonly pageRects:ISize[] = [];
    private currentPageRect:ISize = undefined!;
    private currentPageIndex:number = -1;
    private rowHeight:number;
    private currX:number = 0;
    private currY:number = 0;
    private symbols:{[key:string]:IFontSymbolInfo} = {};
    private texturePages:T[] = [];

    private newPage():void {
        if (this.currentPageRect!==undefined) this.pageRects.push(this.currentPageRect);
        this.currentPageIndex++;
        this.currentPageRect = {
            width: this.WIDTH,
            height:this.rowHeight,
        };
    }

    private putCharOnContext(char:string):void {
        const textWidth:number = this.getLetterWidth(char);
        const textWidthPlusPadding:number = textWidth + 2 * this.SYMBOL_PADDING;
        if (textWidthPlusPadding === 0) return;
        if (this.currX + textWidthPlusPadding > this.WIDTH) {
            this.currX = 0;
            this.currY += this.rowHeight;
            this.currentPageRect.height+=this.rowHeight;
            if (this.currY>this.MAX_HEIGHT) {
                this.currX = 0;
                this.currY = 0;
                this.newPage();
            }
        }
        this.symbols[char] = {
            x: this.currX,
            y: this.currY,
            width: textWidthPlusPadding,
            widthAdvanced: textWidth,
            height: this.rowHeight,
            destOffsetX: 0,
            destOffsetY: 0,
            pageId: this.currentPageIndex,
        };
        this.currX += textWidthPlusPadding;
    }

    public createPartialFontContext(
        standardChars:readonly string[],
        extraChars:readonly string[],
    ):void {
        const lineHeight:number = this.getFontHeight();
        this.rowHeight = lineHeight + 2 * this.SYMBOL_PADDING;

        this.newPage();
        standardChars.forEach(c=>this.putCharOnContext(c));
        extraChars.forEach(c=>this.putCharOnContext(c));
        if (this.pageRects.indexOf(this.currentPageRect)===-1) this.pageRects.push(this.currentPageRect);

        this.partialContext = {
            symbols:this.symbols,
            pageRects:this.pageRects,
            padding: [
                this.SYMBOL_PADDING,
                this.SYMBOL_PADDING,
                this.SYMBOL_PADDING,
                this.SYMBOL_PADDING
            ],
            spacing: [0,0],
            lineHeight,
        };
        this.partialContext.pageRects.forEach((size:ISize,i:number)=>this.generateTexturePage(i,size));
    }

    private generateTexturePage(pageId:number,size:ISize):void {
        const texturePage = this.createTexturePage(size);
        this.texturePages.push(texturePage);
        const symbolsForThisPage =
            Object.keys(this.symbols).
            map(key=>({char:key,info:this.symbols[key]})).
            filter(it=>(it.info.pageId===pageId));
        symbolsForThisPage.forEach(symbol=>{
            const rect:IRectJSON = symbol.info;
            this.drawLetter(
                texturePage,
                symbol.char,
                rect.x + this.SYMBOL_PADDING,
                rect.y + this.SYMBOL_PADDING
            );
        });
    }

    public getPartialContext():IPartialFontContext {
        return this.partialContext;
    }

    public getTexturePages():T[] {
        return this.texturePages;
    }

}
