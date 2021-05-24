import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {Game} from "@engine/core/game";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";

export class SimpleAppearLetterTextAnimation extends AbstractTextAnimation {

    constructor(private readonly apperTime:number) {
        super();
    }

    init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        chars.forEach((c,index)=>{
            c.visible = false;
            game.getCurrentScene().setTimeout(()=>{
                c.visible = true;
            },index*this.apperTime);
        });
    }

}
