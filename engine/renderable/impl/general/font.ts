import {Game} from "@engine/core/game";
import {IRectJSON} from "@engine/geometry/rect";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ITexture} from "@engine/renderer/common/texture";
import {Document, Element} from "@engine/misc/xmlUtils";
import {DebugError} from "@engine/debug/debugError";
import {ISize} from "@engine/geometry/size";
import {Optional} from "@engine/core/declarations";

export interface IFontSymbolInfo extends IRectJSON {
    destOffsetX:number;
    destOffsetY:number;
    widthAdvanced:number;
    pageIndex:number;
}

export interface IFontContext {
    lineHeight: number;
    padding:[up:number,right:number,down:number,left:number];
    spacing: [horizontal:number, vertical:number];
    symbols: Record<string, IFontSymbolInfo>;
    texturePages:ITexture[];
    fontFamily:string;
    fontSize:number;
}

export interface ICssFontParameters {
    fontFamily?: string;
    fontSize?: number;
    chars?: string[];
    extraChars?:string[];
}

const DEFAULT_FONT_PARAMS = {
    fontFamily: 'monospace',
    fontSize: 12
};

const LAT_CHARS:string =
    'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

const STANDART_SYMBOLS:string =
    '1234567890 ' +
    '"!`?\'.,;:()[]{}<>|/@\\^$-%+=#_&~*';


const CYR_CHARS:string =
    'АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНн' +
    'ОоПпРрСсТтУуФфХхЦцЧчШшЩщ' +
    'ЫыЬьЪъЭэЮюЯя' +
    'ЇїІіЄєҐґ';

/*
AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
1234567890
"!`?'.,;:()[]{}<>|/@^$-%+=#_&~*
АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНн
ОоПпРрСсТтУуФфХхЦцЧчШшЩщ
ЫыЬьЪъЭэЮюЯя
ЇїІіЄєҐґ
 */

export namespace FontFactory {

    interface IPrefixedContext {
        mozImageSmoothingEnabled?: boolean;
        webkitImageSmoothingEnabled?: boolean;
        msImageSmoothingEnabled?: boolean;
        oImageSmoothingEnabled?: boolean;
    }

    interface IPartialFontContext {
        symbols: Record<string, IFontSymbolInfo>;
        pageRects:ISize[];
        padding: [up:number,right:number,down:number,left:number];
        spacing: [horizontal:number, vertical:number];
        lineHeight: number;
    }

    const SYMBOL_PADDING = 4 as const;
    const MAX_HEIGHT = 512 as const;
    const WIDTH:number = 512 as const;

    const getCtx = (cnv:HTMLCanvasElement):CanvasRenderingContext2D=>{
        return cnv.getContext('2d') as CanvasRenderingContext2D;
    };

    const getFontHeight = (strFont:string):number=> {
        const parent:HTMLSpanElement = document.createElement("span");
        parent.appendChild(document.createTextNode("height"));
        document.body.appendChild(parent);
        parent.style.cssText = `font: ${strFont}; white-space: nowrap; display: inline-block;line-height:1em;`;
        const height:number = parent.offsetHeight;
        document.body.removeChild(parent);
        return height;
    };

    export const fontAsCss = (fontSize:string|number,fontFamily:string):string=> {
        return `${fontSize}px ${fontFamily}`;
    };

    export const createPartialFontContext =
        (standardChars:readonly string[],
         extraChars:readonly string[],
         strFont:string
    ):IPartialFontContext=> {

        const cnv:HTMLCanvasElement = document.createElement('canvas');
        const ctx:CanvasRenderingContext2D = getCtx(cnv);
        ctx.font = strFont;
        const lineHeight:number = getFontHeight(strFont);
        const rowHeight:number = lineHeight + 2 * SYMBOL_PADDING;
        const symbols:{[key:string]:IFontSymbolInfo} = {};
        let currX:number = 0, currY:number = 0;
        const pageRects:ISize[] = [];
        let currentPageRect:ISize = undefined!;
        let currentPageIndex:number = -1;

        const newPage = ():void=>{
            if (currentPageRect!==undefined) pageRects.push(currentPageRect);
            currentPageIndex++;
            currentPageRect = {
                width: WIDTH,
                height:rowHeight,
            };
        };

        const putCharOnContext = (char:string):void=>{
            const context2D:CanvasRenderingContext2D = cnv.getContext('2d') as CanvasRenderingContext2D;
            const textWidth:number = context2D.measureText(char).width + 2 * SYMBOL_PADDING;
            if (textWidth === 0) return;
            if (currX + textWidth > WIDTH) {
                currX = 0;
                currY += rowHeight;
                currentPageRect.height+=rowHeight;
                if (currY>MAX_HEIGHT) {
                    currX = 0;
                    currY = 0;
                    newPage();
                }
            }
            symbols[char] = {
                x: ~~currX,
                y: ~~currY,
                width: ~~textWidth,
                widthAdvanced: ~~textWidth,
                height: rowHeight,
                destOffsetX: 0,
                destOffsetY: 0,
                pageIndex: currentPageIndex,
            };
            currX += textWidth;
        };

        newPage();
        standardChars.forEach(c=>putCharOnContext(c));
        extraChars.forEach(c=>putCharOnContext(c));
        if (pageRects.indexOf(currentPageRect)===-1) pageRects.push(currentPageRect);

        return {
            symbols,
            pageRects,
            padding: [SYMBOL_PADDING,SYMBOL_PADDING,SYMBOL_PADDING,SYMBOL_PADDING],
            spacing: [0,0],
            lineHeight,
        };
    };

    export const getFontImageBase64 = (contextSymbols:Record<string, IFontSymbolInfo>, pageIndex:number,pageSize:ISize,strFont:string):string=> {
        const cnv:HTMLCanvasElement = document.createElement('canvas');
        cnv.width = pageSize.width;
        cnv.height = pageSize.height;
        const ctx:CanvasRenderingContext2D = getCtx(cnv);
        ctx.font = strFont;
        ctx.textBaseline = 'top';
        ctx.imageSmoothingEnabled = false;
        (ctx as IPrefixedContext).mozImageSmoothingEnabled = false;
        (ctx  as IPrefixedContext).webkitImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).msImageSmoothingEnabled = false;
        (ctx as IPrefixedContext).oImageSmoothingEnabled = false;
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0,0,cnv.width,cnv.height);
        ctx.fillStyle = '#fff';
        const symbolsForThisPage =
            Object.keys(contextSymbols).
            map(key=>({char:key,info:contextSymbols[key]})).
            filter(it=>(it.info.pageIndex===pageIndex));
        symbolsForThisPage.forEach(symbol=>{
            const rect:IRectJSON = symbol.info;
            ctx.fillText(symbol.char,
                rect.x + SYMBOL_PADDING,
                rect.y + SYMBOL_PADDING
            );
            //ctx.fillStyle = 'black';
            // ctx.strokeRect(
            //     rect.x + SYMBOL_PADDING,
            //     rect.y + SYMBOL_PADDING,
            //     rect.width - SYMBOL_PADDING,
            //     rect.height - SYMBOL_PADDING);
            // ctx.fillStyle = '#fff';
        });
        return cnv.toDataURL();
    };

    const querySelector = (doc:Document,path:string):Element=>{
        const res:Element = doc.querySelector(path);
        if (DEBUG && res===undefined) {
            console.error(doc);
            throw new DebugError(`can not receive node ${path} from document`);
        }
        return res;
    };

    export const createFontFromAtlas = async (game:Game,texturePages:ITexture[],doc:Document):Promise<Font>=>{
        // http://www.angelcode.com/products/bmfont/doc/file_format.html
        const [up,right,down,left] = querySelector(doc,'info').getAttribute('padding').split(',').map(it=>+it || 0);
        const [spacingHorizontal, spacingVertical] = querySelector(doc,'info').getAttribute('spacing').split(',').map(it=>+it || 0);
        const lineHeight:number = +(querySelector(doc,'common').getAttribute('lineHeight'));
        const fontFamily:string = querySelector(doc,'info').getAttribute('face');
        const fontSize:number = +querySelector(doc,'info').getAttribute('size');
        const context:IFontContext = {
            texturePages,
            fontFamily,
            fontSize,
            lineHeight,
            padding: [up,right,down,left],
            spacing: [spacingHorizontal, spacingVertical],
            symbols: {}
        };

        const chars:Element[] = doc.querySelectorAll('char');
        for (let i:number=0;i<chars.length;i++){
            const el:Element = chars[i];
            const id:number = +(el.getAttribute('id'));
            const width:number = +(el.getAttribute('width')) || ~~(lineHeight / 3) || 16;
            const widthAdvanced:number = +(el.getAttribute('xadvance')) || width;
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
                widthAdvanced,
                height,
                destOffsetX: xOffset,
                destOffsetY: yOffset,
                pageIndex: +(el.getAttribute('page')) || 0,
            };
        }
        return new Font(game,context);
    };

    export const createFontFromCssDescription = async (game:Game,params:ICssFontParameters,progress?:(n:number)=>void)=>{

        const fontFamily:string = params.fontFamily ?? DEFAULT_FONT_PARAMS.fontFamily;
        const fontSize:number = params.fontSize ?? DEFAULT_FONT_PARAMS.fontSize;

        const cssFontDescription:string = FontFactory.fontAsCss(fontSize,fontFamily);

        const partialContext:IPartialFontContext = createPartialFontContext(
            params.chars ?? (LAT_CHARS + STANDART_SYMBOLS + CYR_CHARS).split(''),
            params.extraChars ?? [],
            cssFontDescription
        );

        const bitmapUrls:string[] =
            partialContext.pageRects.
            map((it,i)=>
                FontFactory.getFontImageBase64(partialContext.symbols,i,it,cssFontDescription));
        const texturePages:ITexture[] = [];

        const resourceLoader:ResourceLoader = new ResourceLoader(game);
        let currProgress:number = 0;
        const progressCallback = (n:number)=>{
            currProgress+=n;
            if (progress!==undefined) progress(currProgress/bitmapUrls.length);
        };
        for (const bitmapUrl of bitmapUrls) {
            const texture:ITexture = await resourceLoader.loadTexture(bitmapUrl,progressCallback);
            texturePages.push(texture);
        }

        const fontContext:IFontContext =
            {
                lineHeight: partialContext.lineHeight,
                padding: partialContext.padding,
                spacing: partialContext.spacing,
                symbols: partialContext.symbols,
                texturePages,
                fontFamily,
                fontSize,
            };

        return new Font(game,fontContext);

    };

    let _systemFontInstance:Optional<Font>;

    export const createSystemFont = async (game:Game):Promise<Font>=> {
        _systemFontInstance =
            _systemFontInstance ||
            await createFontFromCssDescription(game,{fontSize:DEFAULT_FONT_PARAMS.fontSize,fontFamily:DEFAULT_FONT_PARAMS.fontFamily});
        return _systemFontInstance;
    };

}


export class Font {

    constructor(protected game:Game,public readonly context:Readonly<IFontContext>) {

    }

    public readonly type:'Font' = 'Font';

    public asCss():string{
        return FontFactory.fontAsCss(this.context.fontSize,this.context.fontFamily);
    }

    public getSymbolInfoByChar(char:string):IFontSymbolInfo {
        const symbolInfo:IFontSymbolInfo = this.context.symbols[char] || this.context.symbols['?'];
        if (DEBUG && symbolInfo===undefined) {
            throw new DebugError(`no symbol info for character "${char}"`);
        }
        return symbolInfo;
    }

    public getResourceLinkByChar(char:string):ITexture{
        if (char===' ') return this.context.texturePages[0];
        const pageIndex:number = this.getSymbolInfoByChar(char).pageIndex;
        if (DEBUG && (pageIndex<0 || pageIndex>this.context.texturePages.length-1)) {
            throw new DebugError(`wrong page index for character "${char}"`);
        }
        return this.context.texturePages[pageIndex];
    }

    public getSize():number {
        return this.context.fontSize;
    }

    public getFontFamily():string {
        return this.context.fontFamily;
    }

}
