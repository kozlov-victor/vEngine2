import {EventEmitterDelegate, getControlErrorMessage} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";

export class KeyboardEventEmitterDelegate extends EventEmitterDelegate<KEYBOARD_EVENTS|GAME_PAD_EVENTS,IKeyBoardEvent> {

    public override on(eventName: KEYBOARD_EVENTS, callBack: (arg: IKeyBoardEvent) => void): (arg: IKeyBoardEvent) => void {
        if (DEBUG) {
            if (!this.game.hasControl('KeyboardControl'))
                throw new DebugError(getControlErrorMessage('keyboard','KeyboardControl'));
        }
        return super.on(eventName, callBack);
    }

}
