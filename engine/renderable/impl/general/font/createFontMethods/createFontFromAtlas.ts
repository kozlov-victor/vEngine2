import {Game} from "@engine/core/game";
import {XmlDocument, XmlNode} from "@engine/misc/parsers/xml/xmlELements";
import {Font} from "@engine/renderable/impl/general/font/font";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import ITextureWithId = FontTypes.ITextureWithId;
import IFontContext = FontTypes.IFontContext;
import {DebugError} from "@engine/debug/debugError";

const querySelector = (doc:XmlDocument, path:string):XmlNode=>{
    const res:XmlNode = doc.querySelector(path);
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
    const base:number = +(querySelector(doc,'common').getAttribute('base') || lineHeight);
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

    const chars:XmlNode[] = doc.querySelectorAll('char');
    for (let i:number=0;i<chars.length;i++){
        const el:XmlNode = chars[i];
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
