import {Game} from "@engine/core/game";
import {FontContextCanvasFactory} from "@engine/renderable/impl/general/font/factory/fontContextCanvasFactory";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ITexture} from "@engine/renderer/common/texture";
import {Font} from "@engine/renderable/impl/general/font/font";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import ICssFontParameters = FontTypes.ICssFontParameters;
import IPartialFontContext = FontTypes.IPartialFontContext;
import ITextureWithId = FontTypes.ITextureWithId;
import IFontContext = FontTypes.IFontContext;
import {
    CYR_CHARS,
    DEFAULT_FONT_PARAMS, LAT_CHARS,
    STANDARD_SYMBOLS
} from "@engine/renderable/impl/general/font/createFontMethods/params/createFontParams";
import {fontAsCss} from "@engine/renderable/impl/general/font/helpers";

export const createFontFromCssDescription = async (game:Game,params:ICssFontParameters,progress?:(n:number)=>void)=>{

    const fontFamily:string = params.fontFamily ?? DEFAULT_FONT_PARAMS.fontFamily;
    const fontSize:number = params.fontSize ?? DEFAULT_FONT_PARAMS.fontSize;

    const cssFontDescription:string = fontAsCss(fontSize,fontFamily);

    const fontFactory = new FontContextCanvasFactory(cssFontDescription);
    fontFactory.createPartialFontContext(
        params.chars ?? (LAT_CHARS + STANDARD_SYMBOLS + CYR_CHARS).split(''),
        params.extraChars ?? []
    );
    const partialContext:IPartialFontContext = fontFactory.getPartialContext();
    const bitmapUrls:string[] =
        fontFactory.getTexturePages().map(c=>c.canvas.toDataURL());

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
            base:partialContext.lineHeight,
            kerning: {},
            texturePages,
            fontFamily,
            fontSize,
        };

    return new Font(game,fontContext);

};
