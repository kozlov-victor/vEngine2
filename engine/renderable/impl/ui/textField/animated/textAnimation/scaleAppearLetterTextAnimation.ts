import {
    AbstractTextAnimation
} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {Game} from "@engine/core/game";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Tween} from "@engine/animation/tween";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export class ScaleAppearLetterTextAnimation extends AbstractTextAnimation {

    constructor(
        private appearTime:number,
        private animationTime:number,
        private readonly scaleFrom:number = 0.01,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }

    public init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            c.scale.setXY(this.scaleFrom);
            c.visible = false;
            const t = new Tween(game,{
                target: c.scale,
                from: {x:this.scaleFrom,y:this.scaleFrom},
                to: {x:1,y:1},
                time: this.animationTime,
                delayBeforeStart: index * this.appearTime,
                ease: this.easeFn,
                start: _=>c.visible = true,
            });
            game.getCurrentScene().addTween(t);
        });
    }

}
