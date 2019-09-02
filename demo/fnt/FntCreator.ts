import {ResourceLink} from "@engine/resources/resourceLink";
import {Font, IFontContext} from "@engine/renderable/impl/general/font";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/texture";

export namespace FntCreator {

    export const createFont = (game:Game,imgLink:ResourceLink<ITexture>,docLink:ResourceLink<string>):Font=>{
        const ctx:IFontContext = {
            width: imgLink.getTarget().size.width,
            height: imgLink.getTarget().size.height,
            lineHeight: 0,
            symbols: {}
        };

        // http://www.angelcode.com/products/bmfont/doc/file_format.html
        const doc:Document = new DOMParser().parseFromString(docLink.getTarget(),'application/xml');
        ctx.lineHeight = +(doc.querySelector('common')!.getAttribute('lineHeight')!);
        const face:string = doc.querySelector('info')!.getAttribute('face') as string;
        const all:NodeListOf<Element> = doc.querySelectorAll('char');
        for (let i:number=0;i<all.length;i++){
            const el:Element = all[i];
            const id:number = +(el.getAttribute('id') as string);
            const width:number = +(el.getAttribute('width') as string) || ~~(ctx.lineHeight/3) || 16;
            const height:number = +(el.getAttribute('height') as string);
            const x:number = +(el.getAttribute('x') as string);
            const y:number = +(el.getAttribute('y') as string);
            const xOffset:number = +(el.getAttribute('xoffset') as string);
            const yOffset:number = +(el.getAttribute('yoffset') as string);

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