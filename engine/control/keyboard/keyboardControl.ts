import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad, KEY_STATE} from "@engine/control/abstract/abstractKeypad";
import {KeyBoardEvent} from "@engine/control/keyboard/keyboardEvent";
import {Optional} from "@engine/core/declarations";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

const ADDITIONAL_KEYS_MAP:Record<string, number> = {
    'softRight': KEYBOARD_KEY.SOFT_RIGHT,
    'softLeft': KEYBOARD_KEY.SOFT_LEFT,
    'call': KEYBOARD_KEY.CALL
};

export class KeyboardControl extends AbstractKeypad<KeyBoardEvent> implements IControl {

    public override readonly type:string = 'KeyboardControl';

    protected keyPressed: string = KEYBOARD_EVENTS.keyPressed;
    protected keyHold: string = KEYBOARD_EVENTS.keyHold;
    protected keyReleased: string = KEYBOARD_EVENTS.keyReleased;

    declare protected buffer:KeyBoardEvent[];

    private _keyDownListener:(e:KeyboardEvent)=>void;
    private _keyUpListener:(e:KeyboardEvent)=>void;

    protected recycleEvent(e: KeyBoardEvent): void {
        KeyBoardEvent.pool.recycle(e);
    }

    public isJustPressed(key:number):boolean{
        const event:Optional<KeyBoardEvent> = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState===KEY_STATE.KEY_JUST_PRESSED;
    }

    public isReleased(key:number):boolean{
        const event:Optional<KeyBoardEvent> = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState<=KEY_STATE.KEY_JUST_RELEASED;
    }

    public isJustReleased(key:number):boolean {
        const event:Optional<KeyBoardEvent> = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState === KEY_STATE.KEY_JUST_RELEASED;
    }

    public listenTo():void {

        this._keyDownListener = (e:KeyboardEvent)=>{
            // important for kai os, preventDefault invocation disallow correct exit by backSpace
            if (e.keyCode!==KEYBOARD_KEY.BACKSPACE) {
                e.preventDefault();
            }
            e.stopPropagation(); // to prevent page scroll
            const code = KeyboardControl.mapKeyCode(e);
            this.triggerKeyPress(code,e);
        };

        this._keyUpListener  = (e:KeyboardEvent)=>{
            const code = KeyboardControl.mapKeyCode(e);
            this.triggerKeyRelease(code,e);
        };

        globalThis.addEventListener('keydown',this._keyDownListener);
        globalThis.addEventListener('keyup',this._keyUpListener);
    }

    private static mapKeyCode(e:KeyboardEvent):number {
        if (e.keyCode===0) return ADDITIONAL_KEYS_MAP[e.key] ?? e.keyCode;
        else return e.keyCode;
    }

    public triggerKeyPress(code:number,nativeEvent:Event):void {

        const eventFromBuffer:Optional<KeyBoardEvent> = KeyBoardEvent.pool.get();
        if (eventFromBuffer===undefined) {
            if (DEBUG) console.warn('keyboard pool is full');
            return;
        }
        eventFromBuffer.button = code;
        eventFromBuffer.nativeEvent = nativeEvent;

        if (this.isPressed(code)) {
            this.notify(KEYBOARD_EVENTS.keyRepeated,eventFromBuffer);
            KeyBoardEvent.pool.recycle(eventFromBuffer);
            return;
        }

        this.press(eventFromBuffer);
    }

    public triggerKeyRelease(code:number,nativeEvent:Event):void {
        const eventFromBuffer:Optional<KeyBoardEvent> = this.findEvent(code);
        if (eventFromBuffer===undefined) return;
        eventFromBuffer.nativeEvent = nativeEvent;
        this.release(eventFromBuffer);
    }

    public destroy():void{
        globalThis.removeEventListener('keydown',this._keyDownListener);
        globalThis.removeEventListener('keyup',this._keyUpListener);
    }

    public isPressed(key:number):boolean{
        const event:Optional<KeyBoardEvent> = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState>=KEY_STATE.KEY_PRESSED;
    }

    protected override notify(eventName: KEYBOARD_EVENTS, e: KeyBoardEvent): void {
        super.notify(eventName,e);
        this.game.getCurrentScene().keyboardEventHandler.trigger(eventName,e);
    }

    private findEvent(button:number):Optional<KeyBoardEvent> {
        for (const event of this.buffer) {
            if (event.button===button) return event;
        }
        return undefined;
    }

}
