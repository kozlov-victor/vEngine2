import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Game} from "@engine/core/game";
import {Tween} from "@engine/animation/tween";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {MathEx} from "@engine/misc/mathEx";

export class FallLettersTextAnimation extends AbstractTextAnimation {

    constructor(
        private delayTime:number = 2000,
        private delaySeedTime:number = 3000,
        private distance:number = 600,
        private animationTime:number = 1000,
        private easeFn:EaseFn = EasingLinear) {
        super();
    }

    init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            const t = new Tween({
                target: c.pos,
                from: {y:c.pos.y},
                to: {y:c.pos.y+this.distance},
                time: this.animationTime,
                delayBeforeStart: this.delayTime + MathEx.randomInt(0,this.delaySeedTime),
                ease: this.easeFn,
            });
            game.getCurrScene().addTween(t);
        });
    }

}
