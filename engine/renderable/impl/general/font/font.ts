import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";
import {Optional} from "@engine/core/declarations";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import {FontFactory} from "@engine/renderable/impl/general/font/fontFactory";
import IFontContext = FontTypes.IFontContext;
import IFontSymbolInfo = FontTypes.IFontSymbolInfo;
import ITextureWithId = FontTypes.ITextureWithId;

export class Font {

    private readonly DEFAULT_SPACE_INFO:IFontSymbolInfo =
        {
            x:0,
            y:0,
            destOffsetX: 0,
            destOffsetY: 0,
            width: this.context.fontSize,
            height: this.context.lineHeight,
            widthAdvanced: this.context.fontSize,
            pageId: 0
        };

    private readonly DEFAULT_SYMBOL_IN_CONTEXT:string;

    constructor(protected game:Game,public readonly context:Readonly<IFontContext>) {
        this.DEFAULT_SYMBOL_IN_CONTEXT = Object.keys(context.symbols)[0];
    }

    public readonly type:'Font' = 'Font';

    public asCss():string{
        return FontFactory.fontAsCss(this.context.fontSize,this.context.fontFamily);
    }

    public getSymbolInfoByChar(char:string):IFontSymbolInfo {
        if (char===' ' && this.context.symbols[char]===undefined) return this.DEFAULT_SPACE_INFO;
        const symbolInfo:IFontSymbolInfo =
            this.context.symbols[char] ||
            this.context.symbols['?']  ||
            this.context.symbols[this.DEFAULT_SYMBOL_IN_CONTEXT]
        ;
        if (DEBUG && symbolInfo===undefined) {
            throw new DebugError(`no symbol info for character "${char}"`);
        }
        return symbolInfo;
    }


    public getResourceLinkByChar(char:string):ITexture{
        if (DEBUG && this.context.texturePages.length===0) {
            throw new DebugError(`wrong texturePages array`);
        }

        if (char===' ') return this.context.texturePages[0].texture;

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
