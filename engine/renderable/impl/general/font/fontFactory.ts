import {ISize} from "@engine/geometry/size";
import {IRectJSON} from "@engine/geometry/rect";
import {XmlDocument, XmlElement} from "@engine/misc/xmlUtils";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ITexture} from "@engine/renderer/common/texture";
import {Optional} from "@engine/core/declarations";
import {Font} from "@engine/renderable/impl/general/font/font";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";

const DEFAULT_FONT_PARAMS = {
    fontFamily: 'monospace',
    fontSize: 12
};

const LAT_CHARS:string =
    'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

const STANDARD_SYMBOLS:string =
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


    import IFontSymbolInfo = FontTypes.IFontSymbolInfo;
    import ITextureWithId = FontTypes.ITextureWithId;
    import IFontContext = FontTypes.IFontContext;
    import ICssFontParameters = FontTypes.ICssFontParameters;

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

    const createPartialFontContext =
        (standardChars:readonly string[],
         extraChars:readonly string[],
         strFont:string
        ):IPartialFontContext=> {

            const cnv:HTMLCanvasElement = document.createElement('canvas');
            const ctx:CanvasRenderingContext2D = getCtx(cnv);
            ctx.font = strFont;
            const lineHeight:number = ~~getFontHeight(strFont);
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
                const textWidth:number = ~~context2D.measureText(char).width;
                const textWidthPlusPadding:number = textWidth + 2 * SYMBOL_PADDING;
                if (textWidthPlusPadding === 0) return;
                if (currX + textWidthPlusPadding > WIDTH) {
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
                    x: currX,
                    y: currY,
                    width: textWidthPlusPadding,
                    widthAdvanced: textWidth,
                    height: rowHeight,
                    destOffsetX: 0,
                    destOffsetY: 0,
                    pageId: currentPageIndex,
                };
                currX += textWidthPlusPadding;
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

    export const getFontImageBase64 = (contextSymbols:Record<string, IFontSymbolInfo>, pageId:number,pageSize:ISize,strFont:string):string=> {
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
            filter(it=>(it.info.pageId===pageId));
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

    const querySelector = (doc:XmlDocument, path:string):XmlElement=>{
        const res:XmlElement = doc.querySelector(path);
        if (DEBUG && res===undefined) {
            console.error(doc);
            throw new DebugError(`can not receive node ${path} from document`);
        }
        return res;
    };

    export const createFontFromAtlas = async (game:Game,texturePages:ITextureWithId[],doc:XmlDocument):Promise<Font>=>{
        // http://www.angelcode.com/products/bmfont/doc/file_format.html
        const [up,right,down,left] = querySelector(doc,'info').getAttribute('padding').split(',').map(it=>+it || 0);
        const [spacingHorizontal, spacingVertical] = querySelector(doc,'info').getAttribute('spacing').split(',').map(it=>+it || 0);
        const lineHeight:number = +(querySelector(doc,'common').getAttribute('lineHeight'));
        const base:number = +(querySelector(doc,'common').getAttribute('base') || 0);
        const fontFamily:string = querySelector(doc,'info').getAttribute('face');
        const fontSize:number = +querySelector(doc,'info').getAttribute('size');
        const kerning:Record<string, number> = {};
        doc.getElementsByTagName('kerning').forEach(el=>{
            const first:string = String.fromCharCode(+el.getAttribute('first'));
            const second:string = String.fromCharCode(+el.getAttribute('second'));
            kerning[`${first}${second}`] = +el.getAttribute('amount');
        });
        const context:IFontContext = {
            texturePages,
            fontFamily,
            fontSize,
            lineHeight,
            padding: [up,right,down,left],
            spacing: [spacingHorizontal, spacingVertical],
            symbols: {},
            kerning,
            base,
        };

        const chars:XmlElement[] = doc.querySelectorAll('char');
        for (let i:number=0;i<chars.length;i++){
            const el:XmlElement = chars[i];
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
                pageId: +(el.getAttribute('page')) || 0,
            };
        }
        return new Font(game,context);
    };

    export const createFontFromCssDescription = async (game:Game,params:ICssFontParameters,progress?:(n:number)=>void)=>{

        const fontFamily:string = params.fontFamily ?? DEFAULT_FONT_PARAMS.fontFamily;
        const fontSize:number = params.fontSize ?? DEFAULT_FONT_PARAMS.fontSize;

        const cssFontDescription:string = FontFactory.fontAsCss(fontSize,fontFamily);

        const partialContext:IPartialFontContext = createPartialFontContext(
            params.chars ?? (LAT_CHARS + STANDARD_SYMBOLS + CYR_CHARS).split(''),
            params.extraChars ?? [],
            cssFontDescription
        );

        const bitmapUrls:string[] =
            partialContext.pageRects.
            map((it,i)=>
                FontFactory.getFontImageBase64(partialContext.symbols,i,it,cssFontDescription));
        const texturePages:ITextureWithId[] = [];

        const resourceLoader:ResourceLoader = new ResourceLoader(game);
        let currProgress:number = 0;
        const progressCallback = (n:number)=>{
            currProgress+=n;
            if (progress!==undefined) progress(currProgress/bitmapUrls.length);
        };
        let cnt:number = 0;
        for (const bitmapUrl of bitmapUrls) {
            const texture:ITexture = await resourceLoader.loadTexture(bitmapUrl,progressCallback);
            texturePages.push({texture,id:cnt});
            cnt++;
        }

        const fontContext:IFontContext =
            {
                lineHeight: partialContext.lineHeight,
                padding: partialContext.padding,
                spacing: partialContext.spacing,
                symbols: partialContext.symbols,
                kerning: {},
                texturePages,
                fontFamily,
                fontSize,
                base:0,
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
