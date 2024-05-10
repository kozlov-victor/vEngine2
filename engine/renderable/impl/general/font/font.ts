import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";
import {Optional} from "@engine/core/declarations";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import {fontAsCss} from "@engine/renderable/impl/general/font/helpers";
import {
    createFontFromCssDescription
} from "@engine/renderable/impl/general/font/createFontMethods/createFontFromCssDescription";
import {createSystemFont} from "@engine/renderable/impl/general/font/createFontMethods/createSystemFont";
import IFontContext = FontTypes.IFontContext;
import IFontSymbolInfo = FontTypes.IFontSymbolInfo;
import ITextureWithId = FontTypes.ITextureWithId;
import ICssFontParameters = FontTypes.ICssFontParameters;

export class Font {

    public static fromCssDescription(game:Game,desc:ICssFontParameters) {
        return createFontFromCssDescription(game,desc);
    }

    public static getSystemFont(game:Game):Font {
        return createSystemFont(game);
    }

    constructor(protected game:Game,public readonly context:Readonly<IFontContext>) {
        this.DEFAULT_SYMBOL_IN_CONTEXT = context.symbols[Object.keys(context.symbols)[0]];
    }

    private readonly DEFAULT_SPACE_INFO:IFontSymbolInfo =
        {
            x:0,
            y:0,
            destOffsetX: 0,
            destOffsetY: 0,
            width: this.context.fontSize,
            height: this.context.lineHeight  + this.context.padding[0] + this.context.padding[2],
            widthAdvanced: this.context.fontSize,
            pageId: 0
        };

    private readonly DEFAULT_SYMBOL_IN_CONTEXT:IFontSymbolInfo;

    public readonly type = 'Font' as const;

    private static isDefaultChar(char:string):boolean {
        return char===' ' || char==='\n';
    }

    public asCss():string{
        return fontAsCss(this.context.fontSize,this.context.fontFamily);
    }

    public getSymbolInfoByChar(char:string):IFontSymbolInfo {
        if (Font.isDefaultChar(char) && this.context.symbols[char]===undefined) {
            return this.context.symbols[' '] || this.DEFAULT_SPACE_INFO;
        }

        return this.context.symbols[char] ||
            this.context.symbols['?'] ||
            this.DEFAULT_SYMBOL_IN_CONTEXT;
    }


    public getResourceLinkByChar(char:string):ITexture{
        if (DEBUG && this.context.texturePages.length===0) {
            throw new DebugError(`wrong texturePages array`);
        }

        if (Font.isDefaultChar(char)) return this.context.texturePages[0].texture;

        const pageId:number = this.getSymbolInfoByChar(char).pageId;
        if (DEBUG && (pageId<0 || pageId>this.context.texturePages.length-1)) {
            throw new DebugError(`wrong page index for character "${char}"`);
        }

        const textureWithId:Optional<ITextureWithId> = this.context.texturePages.find(it=>it.id===pageId);
        if (DEBUG && !textureWithId) {
            throw new DebugError(`wrong page id: ${pageId}`);
        }
        return textureWithId!.texture;
    }

    public getSize():number {
        return this.context.fontSize;
    }

    public getFontFamily():string {
        return this.context.fontFamily;
    }

    public getKerning(firstChar:string,secondChar:string):number {
        return this.context.kerning[`${firstChar}${secondChar}`] || 0;
    }

}
