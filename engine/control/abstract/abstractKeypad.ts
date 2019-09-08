import {Game} from "@engine/core/game";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";

export enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}


export abstract class KeyPadEvent extends ObservableEntity {
    public keyState:KEY_STATE;
}

export abstract class AbstractKeypad {
    protected game:Game;

    protected abstract keyPressed:string;
    protected abstract keyReleased:string;
    protected abstract keyHold:string;

    protected buffer:KeyPadEvent[] = [];


    constructor(game:Game) {
        this.game = game;
    }

    public press(event:KeyPadEvent):void{
        event.keyState = KEY_STATE.KEY_PRESSED;
        this.buffer.push(event);
        this.notify(this.keyPressed,event);
    }

    public release(event:KeyPadEvent):void{
        event.keyState = KEY_STATE.KEY_JUST_RELEASED;
        this.notify(this.keyReleased,event);
    }


    public update():void {

        for (const event of this.buffer) {
            const keyVal:KEY_STATE = event.keyState;
            if (keyVal===KEY_STATE.KEY_RELEASED) {
                this.buffer.splice(this.buffer.indexOf(event),1);
                event.release();
            }
            else if (keyVal===KEY_STATE.KEY_JUST_RELEASED) {
                event.keyState = KEY_STATE.KEY_RELEASED;
            }
            else if (keyVal===KEY_STATE.KEY_JUST_PRESSED) {
                event.keyState = KEY_STATE.KEY_PRESSED;
            }
            this.notify(this.keyHold, event);
        }
    }

    private notify(eventName:string,e:KeyPadEvent):void{
        this.game.getCurrScene().trigger(eventName,e);
    }

}