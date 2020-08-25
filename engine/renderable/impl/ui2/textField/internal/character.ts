import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {Font, IRectViewJSON} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";

export class Character extends Image {

    constructor(game:Game,font:Font,char:string) {
        super(game);
        let charRect:IRectViewJSON = font.fontContext.symbols[char] || font.fontContext.symbols['?'];
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
    }

}
