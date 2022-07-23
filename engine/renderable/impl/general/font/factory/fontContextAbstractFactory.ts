import {ISize} from "@engine/geometry/size";
import {IRectJSON} from "@engine/geometry/rect";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import IFontSymbolInfo = FontTypes.IFontSymbolInfo;
import IPartialFontContext = FontTypes.IPartialFontContext;
import {Font} from "@engine/renderable/impl/general/font/font";
import ITextureWithId = FontTypes.ITextureWithId;
import IFontContext = FontTypes.IFontContext;
import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";

export abstract class FontContextAbstractFactory<T> {

    private readonly SYMBOL_PADDING = 4 as const;
    private readonly MAX_HEIGHT = 512 as const;
    private readonly WIDTH:number = 512 as const;


    protected abstract getLetterWidth(letter:string):number;
    protected abstract getFontHeight():number;
    protected abstract createTexturePage(size:ISize):T;
    protected abstract texturePageToTexture(page:T):ITexture;
    protected abstract drawLetter(context:T,letter:string,x:number,y:number):void;

    private fontFamily:string;
    private fontSize:number;

    private partialContext:IPartialFontContext;
    private readonly pageRects:ISize[] = [];
    private currentPageRect:ISize = undefined!;
    private currentPageIndex:number = -1;
    private rowHeight:number;
    private currX:number = 0;
    private currY:number = 0;
    private symbols:{[key:string]:IFontSymbolInfo} = {};
    private texturePages:T[] = [];

    protected constructor(protected game:Game) {
    }

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
        if (textWidth === 0) return;
        const textWidthPlusPadding:number = textWidth + 2 * this.SYMBOL_PADDING;
        if (this.currX + textWidthPlusPadding > this.WIDTH) {
            this.currX = 0;
            this.currY += this.rowHeight;
            this.currentPageRect.height += this.rowHeight;
            if (this.currY > this.MAX_HEIGHT) {
                this.currX = 0;
                this.currY = 0;
                this.newPage();
            }
        }
        this.symbols[char] = {
            x: this.currX + this.SYMBOL_PADDING,
            y: this.currY + this.SYMBOL_PADDING,
            width: textWidthPlusPadding,
            widthAdvanced: textWidth,
            height: this.getFontHeight(),
            destOffsetX: 0,
            destOffsetY: 0,
            pageId: this.currentPageIndex,
        };
        this.currX += textWidthPlusPadding;
    }

    public createFont(
        standardChars:readonly string[],
        extraChars:readonly string[],
        fontFamily:string,
        fontSize:number
    ):Font {
        const lineHeight:number = this.getFontHeight();
        this.rowHeight = lineHeight + 2 * this.SYMBOL_PADDING;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;

        this.newPage();
        standardChars.forEach(c=>this.putCharOnContext(c));
        extraChars.forEach(c=>this.putCharOnContext(c));
        if (this.pageRects.indexOf(this.currentPageRect)===-1) this.pageRects.push(this.currentPageRect);

        this.partialContext = {
            symbols:this.symbols,
            pageRects:this.pageRects,
            padding: [
                0,0,0,0
            ],
            spacing: [0,0],
            lineHeight,
        };
        this.partialContext.pageRects.forEach((size:ISize,i:number)=>this.generateTexturePage(i,size));
        return this._createFont();
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
                rect.x,
                rect.y
            );
        });
    }

    private _createFont():Font {
        const partialContext:IPartialFontContext = this.partialContext;

        const texturePages:ITextureWithId[] = [];
        let cnt:number = 0;
        for (const texturePage of this.texturePages) {
            const texture = this.texturePageToTexture(texturePage);
            texturePages.push({texture,id:cnt});
            cnt++;
        }
        const fontContext:IFontContext =
            {
                lineHeight: partialContext.lineHeight,
                padding: partialContext.padding,
                spacing: partialContext.spacing,
                symbols: partialContext.symbols,
                base:partialContext.lineHeight,
                kerning: {},
                texturePages,
                fontFamily:this.fontFamily,
                fontSize:this.fontSize,
            };
        return new Font(this.game,fontContext);
    }

}
