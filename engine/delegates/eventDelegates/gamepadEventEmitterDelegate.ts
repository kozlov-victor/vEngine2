import {EventEmitterDelegate, getControlErrorMessage} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {DebugError} from "@engine/debug/debugError";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class GamepadEventEmitterDelegate extends EventEmitterDelegate<KEYBOARD_EVENTS,IGamePadEvent> {
    public override on(eventName: KEYBOARD_EVENTS, callBack: (arg: IGamePadEvent) => void): (arg: IGamePadEvent) => void {
        if (DEBUG) {
            if (!this.game.hasControl('GamePadControl'))
                throw new DebugError(getControlErrorMessage('gamepad','GamePadControl'));
        }
        return super.on(eventName, callBack);
    }
}
