import {ResourceLink} from "@engine/resources/resourceLink";
import {Font, IFontContext} from "@engine/renderable/impl/general/font";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {Document, Element, IDocumentDescription} from "@engine/misc/xmlUtils";

export namespace FntCreator {

    export const createFont = (game:Game,resourceLink:ResourceLink<ITexture>,docDesc:IDocumentDescription):Font=>{

        const doc:Document = Document.create(docDesc);

        const context:IFontContext = {
            width: resourceLink.getTarget().size.width,
            height: resourceLink.getTarget().size.height,
            lineHeight: 0,
            symbols: {}
        };

        // http://www.angelcode.com/products/bmfont/doc/file_format.html
        const lineHeight:number = +(doc.querySelector('common').getAttribute('lineHeight'));
        const face:string = doc.querySelector('info').getAttribute('face');
        const all:Element[] = doc.querySelectorAll('char');
        for (let i:number=0;i<all.length;i++){
            const el:Element = all[i];
            const id:number = +(el.getAttribute('id'));
            const width:number = +(el.getAttribute('width')) || ~~(lineHeight / 3) || 16;
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
                height,
                destOffsetX: xOffset,
                destOffsetY: yOffset
            };
            context.lineHeight = lineHeight;
        }
        return new Font(game,{fontFamily:face,fontSize:lineHeight,resourceLink,context});
    };

}
