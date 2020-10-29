import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Game} from "@engine/core/game";
import {Point2d} from "@engine/geometry/point2d";
import {Tween} from "@engine/animation/tween";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {MathEx} from "@engine/misc/mathEx";

export class AppearRandomLetterTextAnimation extends AbstractTextAnimation {

    constructor(
        private seed:number) {
        super();
    }

    init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            c.visible = false;
            game.getCurrScene().setTimeout(()=>{
                c.visible = true;
            },MathEx.random(0,this.seed))
        });
    }

}