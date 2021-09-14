import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Game} from "@engine/core/game";
import {Point2d} from "@engine/geometry/point2d";
import {Tween} from "@engine/animation/tween";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export class AppearFromPointTextAnimation extends AbstractTextAnimation {

    constructor(
        private point:IPoint,
        private appearTime:number,
        private animationTime:number,
        private easeFn:EaseFn = EasingLinear) {
        super();
    }

    public init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            const fromPoint:Point2d = new Point2d(
                this.point.x - c.parent.pos.x - c.parent.parent.pos.x - c.parent.parent.parent.pos.x - textField.pos.x,
                this.point.y - c.parent.pos.y - c.parent.parent.pos.y - c.parent.parent.parent.pos.y - textField.pos.y
            );
            c.visible = false;
            const t = new Tween(game,{
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
