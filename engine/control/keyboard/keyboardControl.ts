import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad, KEY_STATE} from "@engine/control/abstract/abstractKeypad";
import {KeyBoardEvent} from "@engine/control/keyboard/keyboardEvent";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

const ADDITIONAL_KEYS_MAP:Record<string, number> = {
    'SoftRight': KEYBOARD_KEY.SOFT_RIGHT,
    'SoftLeft': KEYBOARD_KEY.SOFT_LEFT,
    'Call': KEYBOARD_KEY.CALL,
};

export class KeyboardControl extends AbstractKeypad<KeyBoardEvent> implements IControl {

    public override readonly type:string = 'KeyboardControl';

    private _keyDownListener:(e:KeyboardEvent)=>void;
    private _keyUpListener:(e:KeyboardEvent)=>void;

    protected createEvent(): KeyBoardEvent {
        return KeyBoardEvent.pool.get();
    }

    protected recycleEvent(e: KeyBoardEvent): void {
        KeyBoardEvent.pool.recycle(e);
    }

    public listenTo():void {

        this._keyDownListener = (e:KeyboardEvent)=>{
            // important for kai os, preventDefault invocation disallow correct exit by backSpace
            if (e.keyCode!==KEYBOARD_KEY.BACKSPACE) {
                e.preventDefault();
            }
            e.stopPropagation(); // to prevent page scroll
            const code = KeyboardControl.mapKeyCode(e);
            if (this.isPressed(code)) {
                const event = this.createEvent();
                event.button = code;
                event.keyState = KEY_STATE.KEY_PRESSED;
                event.nativeEvent = e;
                this.onEventTriggered(KEYBOARD_EVENTS.keyRepeated,event);
                this.recycleEvent(event);
            }
            else {
                this.press(code, e);
            }
        };

        this._keyUpListener  = (e:KeyboardEvent)=>{
            const code = KeyboardControl.mapKeyCode(e);
            this.release(code, e);
        };

        globalThis.addEventListener('keydown',this._keyDownListener);
        globalThis.addEventListener('keyup',this._keyUpListener);
    }

    private static mapKeyCode(e:KeyboardEvent):number {
        if (e.keyCode===0) return ADDITIONAL_KEYS_MAP[e.key] ?? e.keyCode;
        else return e.keyCode;
    }

    public destroy():void{
        globalThis.removeEventListener('keydown',this._keyDownListener);
        globalThis.removeEventListener('keyup',this._keyUpListener);
    }

    protected override onEventTriggered(eventName: KEYBOARD_EVENTS, e: KeyBoardEvent): void {
        super.onEventTriggered(eventName,e);
        this.game.getCurrentScene().keyboardEventHandler.trigger(eventName,e);
    }

}
