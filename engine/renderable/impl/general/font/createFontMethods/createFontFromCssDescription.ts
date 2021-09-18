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

export const createFontFromCssDescription = (game:Game,params:ICssFontParameters):Font=>{

    const fontFamily:string = params.fontFamily ?? DEFAULT_FONT_PARAMS.fontFamily;
    const fontSize:number = params.fontSize ?? DEFAULT_FONT_PARAMS.fontSize;

    const cssFontDescription:string = fontAsCss(fontSize,fontFamily);

    const fontFactory = new FontContextCanvasFactory(game,cssFontDescription);
    return fontFactory.createFont(
        params.chars ?? (LAT_CHARS + STANDARD_SYMBOLS + CYR_CHARS).split(''),
        params.extraChars ?? [],
        fontFamily, fontSize
    );

};
