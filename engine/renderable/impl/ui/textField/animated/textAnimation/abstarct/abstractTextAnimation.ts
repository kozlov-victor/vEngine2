import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Game} from "@engine/core/game";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";

export abstract class AbstractTextAnimation {

    abstract init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]):void;

}
