import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Font, IFontContext} from "@engine/model/impl/general/font";
import {Game} from "@engine/game";

export namespace FntCreator {

    export const createFont = (game:Game,imgLink:ResourceLink<Texture>,docLink:ResourceLink<string>):Font=>{
        const ctx:IFontContext = {
            width: imgLink.getTarget().size.width,
            height: imgLink.getTarget().size.height,
            lineHeight: null,
            symbols: {}
        };

        // http://www.angelcode.com/products/bmfont/doc/file_format.html
        const doc:Document = new DOMParser().parseFromString(docLink.getTarget(),'application/xml');
        ctx.lineHeight = +doc.querySelector('common').getAttribute('lineHeight');
        const face:string = doc.querySelector('info').getAttribute('face');
        const all:NodeListOf<Element> = doc.querySelectorAll('char');
        for (let i:number=0;i<all.length;i++){
            const el:Element = all[i];
            const id:number = +el.getAttribute('id');
            const width:number = +el.getAttribute('width') || ~~(ctx.lineHeight/3) || 16;
            const height:number = +el.getAttribute('height');
            const x:number = +el.getAttribute('x');
            const y:number = +el.getAttribute('y');
            const xOffset:number = +el.getAttribute('xoffset');
            const yOffset:number = +el.getAttribute('yoffset');

            const char:string = String.fromCharCode(id);
            ctx.symbols[char] = {
                x,
                y,
                width,
                height,
                destOffsetX: xOffset,
                destOffsetY: yOffset
            };

        }
        const fnt:Font = Font.fromAtlas(game,imgLink,ctx);
        fnt.fontFamily = face;
        fnt.fontSize = ctx.lineHeight;
        return fnt;
    };

}