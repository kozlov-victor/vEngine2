import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Game} from "@engine/core/game";
import {Point2d} from "@engine/geometry/point2d";
import {Tween} from "@engine/animation/tween";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {MathEx} from "@engine/misc/mathEx";

export class AppearFromRandomPointTextAnimation extends AbstractTextAnimation {

    constructor(
        private seed:number,
        private appearTime:number,
        private animationTime:number,
        private easeFn:EaseFn = EasingLinear) {
        super();
    }

    init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            const x = MathEx.random(-this.seed,this.seed);
            const y = MathEx.random(-this.seed,this.seed);
            const fromPoint:Point2d = new Point2d(x, y);
            c.visible = false;
            const t = new Tween({
                target: c.pos,
                from: {x: fromPoint.x, y: fromPoint.y},
                to: c.pos.toJSON(),
                time: this.animationTime,
                delayBeforeStart: index * this.appearTime,
                ease: this.easeFn,
                start:()=>c.visible = true,
            });
            game.getCurrentScene().addTween(t);
        });
    }

}
