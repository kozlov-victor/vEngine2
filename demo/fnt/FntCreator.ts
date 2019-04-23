import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Font, FontContext} from "@engine/model/impl/font";
import {Scene} from "@engine/model/impl/scene";
import {Game} from "@engine/game";

export namespace FntCreator {

    export const createFont = (game:Game,imgLink:ResourceLink<Texture>,docLink:ResourceLink<string>):Font=>{
        const ctx:FontContext = {
            width: 320,
            height: 256,
            lineHeight: null,
            symbols: {}
        };

        // http://www.angelcode.com/products/bmfont/doc/file_format.html
        const doc:Document = new DOMParser().parseFromString(docLink.getTarget(),'application/xml');
        ctx.lineHeight = +doc.querySelector('common').getAttribute('lineHeight');
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
                x: x,
                y: y,
                width: width,
                height: height,
                destOffsetX: xOffset,
                destOffsetY: yOffset
            }

        }
        return Font.fromAtlas(game,imgLink,ctx);
    }

}