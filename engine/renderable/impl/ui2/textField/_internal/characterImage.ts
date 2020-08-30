import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {Color} from "@engine/renderer/common/color";
import {IRectJSON} from "@engine/geometry/rect";

export class CharacterImage extends Image {

    constructor(game:Game,font:Font,char:string,color:Color) {
        super(game);
        let charRect:IRectJSON = font.fontContext.symbols[char] || font.fontContext.symbols['?'];
        if (charRect===undefined) {
            const key:string = Object.keys(font.fontContext.symbols)[0];
            if (DEBUG && key===undefined) {
                throw new DebugError(`Bad fontContext has been provided`);
            }
            charRect = font.fontContext.symbols[key];
        }
        this.getSrcRect().set(charRect);
        this.size.set(charRect);
        this.setResourceLink(font.getResourceLink());
        this.color = color;
    }

}
