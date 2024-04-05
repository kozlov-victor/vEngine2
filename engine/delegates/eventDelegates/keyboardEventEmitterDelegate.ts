import {EventEmitterDelegate, getControlErrorMessage} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {DebugError} from "@engine/debug/debugError";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class KeyboardEventEmitterDelegate extends EventEmitterDelegate<KEYBOARD_EVENTS,IKeyBoardEvent> {

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

    public onceKeyPressed(key:KEYBOARD_KEY,callBack: (arg: IKeyBoardEvent) => void): void {
        const ref =
            this.on(KEYBOARD_EVENTS.keyPressed, e=>{
                if (e.button===key) {
                    callBack(e);
                    this.off(KEYBOARD_EVENTS.keyPressed, ref);
                }
            });
    }

    public offKeyPressed(callBack: (arg: IKeyBoardEvent) => void):void {
        this.off(KEYBOARD_EVENTS.keyPressed,callBack);
    }

    public onKeyHold(key:KEYBOARD_KEY,callBack: (arg: IKeyBoardEvent) => void):(arg: IKeyBoardEvent) => void {
        return this.on(KEYBOARD_EVENTS.keyHold, e=>{
            if (e.button===key) callBack(e);
        });
    }

    public offKeyHold(callBack: (arg: IKeyBoardEvent) => void):void {
        this.off(KEYBOARD_EVENTS.keyHold,callBack);
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
