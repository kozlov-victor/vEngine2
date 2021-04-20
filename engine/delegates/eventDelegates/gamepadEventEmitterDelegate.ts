import {EventEmitterDelegate, getControlErrorMessage} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";

export class GamepadEventEmitterDelegate extends EventEmitterDelegate<KEYBOARD_EVENTS|GAME_PAD_EVENTS,IGamePadEvent> {
    on(eventName: KEYBOARD_EVENTS | GAME_PAD_EVENTS, callBack: (arg: IGamePadEvent) => void): (arg: IGamePadEvent) => void {
        if (DEBUG) {
            if (!Game.getInstance().hasControl('GamePadControl'))
                throw new DebugError(getControlErrorMessage('gamepad','GamePadControl'));
        }
        return super.on(eventName, callBack);
    }
}
