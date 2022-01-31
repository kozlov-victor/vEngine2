import {EventEmitterDelegate, getControlErrorMessage} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {DebugError} from "@engine/debug/debugError";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export class KeyboardEventEmitterDelegate extends EventEmitterDelegate<KEYBOARD_EVENTS|GAME_PAD_EVENTS,IKeyBoardEvent> {

    public override on(eventName: KEYBOARD_EVENTS, callBack: (arg: IKeyBoardEvent) => void): (arg: IKeyBoardEvent) => void {
        if (DEBUG) {
            if (!this.game.hasControl('KeyboardControl'))
                throw new DebugError(getControlErrorMessage('keyboard','KeyboardControl'));
        }
        return super.on(eventName, callBack);
    }

    public onKeyPressed(key:KEYBOARD_KEY,callBack: (arg: IKeyBoardEvent) => void):(arg: IKeyBoardEvent) => void {
        return this.on(KEYBOARD_EVENTS.keyPressed, e=>{
            if (e.button===key) callBack(e);
        });
    }

    public offKeyPressed(callBack: (arg: IKeyBoardEvent) => void):void {
        this.off(KEYBOARD_EVENTS.keyPressed,callBack);
    }

    public onKeyReleased(key:KEYBOARD_KEY,callBack: (arg: IKeyBoardEvent) => void):(arg: IKeyBoardEvent) => void {
        return this.on(KEYBOARD_EVENTS.keyReleased, e=>{
            if (e.button===key) callBack(e);
        });
    }

    public offKeyReleased(callBack: (arg: IKeyBoardEvent) => void):void {
        this.off(KEYBOARD_EVENTS.keyReleased,callBack);
    }


}
