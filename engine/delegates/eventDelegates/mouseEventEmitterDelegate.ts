import {EventEmitterDelegate, getControlErrorMessage} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";

export class MouseEventEmitterDelegate<U> extends EventEmitterDelegate<MOUSE_EVENTS,U> {
    public override on(eventName: MOUSE_EVENTS, callBack: (arg: U) => void): (arg: U) => void {
        if (DEBUG) {
            if (!Game.getInstance().hasControl('MouseControl'))
                throw new DebugError(getControlErrorMessage('mouse','MouseControl'));
        }
        return super.on(eventName, callBack);
    }
}
