import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {TextFieldWithoutCache} from "@engine/renderable/impl/ui/textField/simple/textField";
import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";

export class AnimatedTextField extends TextFieldWithoutCache {

    private animation:AbstractTextAnimation;

    constructor(game: Game, font: Font) {
        super(game, font);
    }

    public setTextWithAnimation(text: string | number, animation: AbstractTextAnimation) {
        this.setText(text);
        this.animation = animation;
    }

    revalidate() {
        super.revalidate();
        if (this.animation!==undefined) this.animation.init(this.game,this,this.collectAllChars());
    }

}
