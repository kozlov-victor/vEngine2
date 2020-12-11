import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {Game} from "@engine/core/game";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Tween} from "@engine/animation/tween";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export class AlphaAppearLetterTextAnimation extends AbstractTextAnimation {

    constructor(
        private appearTime:number,
        private animationTime:number,
        private readonly alphaFrom:number = 0.01,
        private readonly easeFn:EaseFn = EasingLinear
    ) {
        super();
    }

    init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            c.alpha = this.alphaFrom;
            c.visible = false;
            const t = new Tween({
                target: c,
                from: {alpha:this.alphaFrom},
                to: {alpha:1},
                time: this.animationTime,
                delayBeforeStart: index * this.appearTime,
                ease: this.easeFn,
                start: _=>c.visible = true,
            });
            game.getCurrScene().addTween(t);
        });
    }

}
