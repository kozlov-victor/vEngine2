import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {Font, IRectViewJSON} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {Color} from "@engine/renderer/common/color";
import {ICharacterInfo} from "@engine/renderable/impl/ui/textField/_internal/characterUtil";

export class CharacterImage extends Image {

    constructor(game:Game,font:Font,characterInfo:ICharacterInfo,color:Color) {
        super(game);
        let charRect:IRectViewJSON = font.fontContext.symbols[characterInfo.rawChar] || font.fontContext.symbols['?'];
        if (charRect===undefined) {
            const key:string = Object.keys(font.fontContext.symbols)[0];
            if (DEBUG && key===undefined) {
                throw new DebugError(`Bad fontContext has been provided`);
            }
            charRect = font.fontContext.symbols[key];
        }
        if (DEBUG) {
            if (charRect.width===0 || charRect.height===0) {
                console.error(font.fontContext);
                console.error(characterInfo);
                throw new DebugError(`font context error: wrong character rect for symbol "${characterInfo.rawChar}"`);
            }
        }
        this.getSrcRect().set(charRect);
        this.size.set(charRect);
        this.pos.setXY(charRect.destOffsetX,charRect.destOffsetY);
        this.setResourceLink(font.getResourceLink());
        if (!characterInfo.isEmoji) this.color = color;
    }

}
