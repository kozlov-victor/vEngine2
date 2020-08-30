import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {Color} from "@engine/renderer/common/color";
import {IRectJSON} from "@engine/geometry/rect";
import {ICharacterInfo} from "@engine/renderable/impl/ui2/textField/_internal/characterUtil";

export class CharacterImage extends Image {

    constructor(game:Game,font:Font,characterInfo:ICharacterInfo,color:Color) {
        super(game);
        let charRect:IRectJSON = font.fontContext.symbols[characterInfo.rawChar] || font.fontContext.symbols['?'];
        if (charRect===undefined) {
            const key:string = Object.keys(font.fontContext.symbols)[0];
            if (DEBUG && key===undefined) {
                throw new DebugError(`Bad fontContext has been provided`);
            }
            charRect = font.fontContext.symbols[key];
        }
        this.getSrcRect().set(charRect);
        this.getSrcRect().set(charRect);
        this.size.set(charRect);
        this.setResourceLink(font.getResourceLink());
        if (!characterInfo.isEmoji) this.color = color;
    }

}
