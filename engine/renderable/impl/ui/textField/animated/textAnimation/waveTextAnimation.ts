import {AbstractTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/abstarct/abstractTextAnimation";
import {Game} from "@engine/core/game";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Timer} from "@engine/misc/timer";

export class WaveTextAnimation extends AbstractTextAnimation {

    private initialPositions:number[];
    private timer:Timer;

    constructor(
        private readonly amplitude:number,
        private readonly frequency:number = 0.3,
        private readonly letterOffsetFactor:number = 10)
    {
        super();
    }

    public init(game:Game,textField:AnimatedTextField,chars: CharacterImage[]): void {
        this.initialPositions = [];
        chars.forEach((c,index)=>{
            this.initialPositions.push(c.pos.y);
        });
        if (this.timer!==undefined) this.timer.kill();
        this.timer = game.getCurrentScene().setInterval(()=>{
            chars.forEach((c,index)=>{
                c.pos.y = this.initialPositions[index] +
                    this.amplitude*Math.sin(2*Math.PI*this.frequency*game.getCurrentTime()/1000+index*this.letterOffsetFactor);
            });
        },100);
    }

}
