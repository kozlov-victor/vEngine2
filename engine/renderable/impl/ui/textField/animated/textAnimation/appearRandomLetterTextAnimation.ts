import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Game} from "@engine/core/game";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
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
            },MathEx.random(0,this.seed));
        });
    }

}
