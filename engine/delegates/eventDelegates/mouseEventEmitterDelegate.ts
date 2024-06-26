import {EventEmitterDelegate, getControlErrorMessage} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {IInteractive} from "@engine/core/declarations";

export class MouseEventEmitterDelegate<U> extends EventEmitterDelegate<MOUSE_EVENTS,U> {

    constructor(game: Game,private model:IInteractive) {
        super(game);
    }

    public override on(eventName: MOUSE_EVENTS, callBack: (arg: U) => void): (arg: U) => void {
        if (DEBUG) {
            if (!this.game.hasControl('MouseControl'))
                throw new DebugError(getControlErrorMessage('mouse','MouseControl'));
        }
        (this.model as {interactive:boolean}).interactive = true;
        return super.on(eventName, callBack);
    }
}
