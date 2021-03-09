import {IRectJSON} from "@engine/geometry/rect";
import {ITexture} from "@engine/renderer/common/texture";

export namespace FontTypes {
    export interface IFontSymbolInfo extends IRectJSON {
        destOffsetX: number;
        destOffsetY: number;
        widthAdvanced: number;
        pageId: number;
    }

    export interface ITextureWithId {
        texture: ITexture;
        id: number;
    }

    export interface IFontContext {
        lineHeight: number;
        padding: [up: number, right: number, down: number, left: number];
        spacing: [horizontal: number, vertical: number];
        symbols: Record<string, IFontSymbolInfo>;
        kerning: Record<string, number>;
        texturePages: ITextureWithId[];
        fontFamily: string;
        fontSize: number;
    }

    export interface ICssFontParameters {
        fontFamily?: string;
        fontSize?: number;
        chars?: string[];
        extraChars?: string[];
    }
}
