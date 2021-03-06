import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad, KEY_STATE} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {Optional} from "@engine/core/declarations";


export class KeyboardControl extends AbstractKeypad<KeyBoardEvent> implements IControl {

    public readonly type:string = 'KeyboardControl';

    protected keyPressed: string = KEYBOARD_EVENTS.keyPressed;
    protected keyHold: string = KEYBOARD_EVENTS.keyHold;
    protected keyReleased: string = KEYBOARD_EVENTS.keyReleased;

    declare protected buffer:KeyBoardEvent[];

    private _keyDownListener:(e:KeyboardEvent)=>void;
    private _keyUpListener:(e:KeyboardEvent)=>void;

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
            e.preventDefault();
            e.stopPropagation(); // to prevent page scroll
            const code:number = e.keyCode;
            this.triggerKeyPress(code,e);
        };

        this._keyUpListener  = (e:KeyboardEvent)=>{
            const code:number = e.keyCode;
            this.triggerKeyRelease(code,e);
        };

        globalThis.addEventListener('keydown',this._keyDownListener);
        globalThis.addEventListener('keyup',this._keyUpListener);
    }

    public triggerKeyPress(code:number,nativeEvent:Event):void {

        const eventFromBuffer:Optional<KeyBoardEvent> = KeyBoardEvent.fromPool();
        if (eventFromBuffer===undefined) {
            if (DEBUG) console.warn('keyboard pool is full');
            return;
        }
        eventFromBuffer.key = code;
        eventFromBuffer.nativeEvent = nativeEvent;

        if (this.isPressed(code)) {
            this.notify(KEYBOARD_EVENTS.keyRepeated,eventFromBuffer);
            eventFromBuffer.release();
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

    protected notify(eventName: KEYBOARD_EVENTS, e: KeyBoardEvent): void {
        this.game.getCurrentScene().keyboardEventHandler.trigger(eventName,e);
    }

    private findEvent(key:number):Optional<KeyBoardEvent> {
        for (const event of this.buffer) {
            if (event.key===key) return event;
        }
        return undefined;
    }

}
