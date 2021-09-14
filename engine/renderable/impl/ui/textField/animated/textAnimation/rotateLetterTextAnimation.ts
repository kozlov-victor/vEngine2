import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {Game} from "@engine/core/game";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Tween} from "@engine/animation/tween";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export class RotateLetterTextAnimation extends AbstractTextAnimation {

    constructor(readonly rotationTime:number,private readonly angleFrom:number, private easeFn:EaseFn = EasingLinear) {
        super();
    }

    public init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            c.visible = false;
            const t = new Tween(game,{
                target: c.angle3d,
                from: {z: this.angleFrom},
                to: {z:0},
                time: this.rotationTime,
                delayBeforeStart: index * this.rotationTime,
                ease: this.easeFn,
                start:()=>c.visible = true,
            });
            game.getCurrentScene().addTween(t);
        });
    }

}
