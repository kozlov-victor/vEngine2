import {Game} from "@engine/core/game";
import {ObservableEntity} from "@engine/geometry/abstract/observableEntity";
import {DebugError} from "@engine/debug/debugError";

export enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}


export abstract class KeyPadEvent extends ObservableEntity {
    public keyState:KEY_STATE;
}

export abstract class AbstractKeypad<T extends KeyPadEvent> {
    protected game:Game;

    protected abstract keyPressed:string;
    protected abstract keyReleased:string;
    protected abstract keyHold:string;

    protected buffer:T[] = [];


    constructor(game:Game) {
        this.game = game;
    }

    public press(event:T):void{
        event.keyState = KEY_STATE.KEY_PRESSED;
        this.buffer.push(event);
        this.notify(this.keyPressed,event);
    }

    public release(event:T):void{
        event.keyState = KEY_STATE.KEY_JUST_RELEASED;
        this.notify(this.keyReleased,event);
    }

    public update():void {
        for (const event of this.buffer) {
            if (!event.isCaptured()) continue;
            const keyVal:KEY_STATE = event.keyState;
            switch (keyVal) {
                case KEY_STATE.KEY_RELEASED:
                    this.buffer.splice(this.buffer.indexOf(event),1);
                    event.release();
                    break;
                case KEY_STATE.KEY_JUST_RELEASED:
                    event.keyState = KEY_STATE.KEY_RELEASED;
                    break;
                case KEY_STATE.KEY_JUST_PRESSED:
                    event.keyState = KEY_STATE.KEY_PRESSED;
                    break;
                case KEY_STATE.KEY_PRESSED:
                    this.notify(this.keyHold, event);
                    break;
                default:
                    if (DEBUG) throw new DebugError(`unknown button state: ${keyVal}`);
                    break;
            }
        }
    }

    protected abstract notify(eventName:string,e:T):void;

}
