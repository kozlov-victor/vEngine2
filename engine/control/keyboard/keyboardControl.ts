import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad, KEY_STATE} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {Optional} from "@engine/core/declarations";


export class KeyboardControl extends AbstractKeypad implements IControl {

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
            this.triggerKeyPress(code);
        };

        this._keyUpListener  = (e:KeyboardEvent)=>{
            const code:number = e.keyCode;
            this.triggerKeyRelease(code);
        };

        globalThis.addEventListener('keydown',this._keyDownListener);
        globalThis.addEventListener('keyup',this._keyUpListener);
    }

    public triggerKeyPress(code:number):void {
        if (this.isPressed(code)) return; // keyboard generate repeated events when key is pressed - ignore it

        const eventFromBuffer:Optional<KeyBoardEvent> = KeyBoardEvent.fromPool();
        if (eventFromBuffer===undefined) {
            if (DEBUG) console.warn('keyboard pool is full');
            return;
        }
        eventFromBuffer.key = code;
        this.press(eventFromBuffer);
    }

    public triggerKeyRelease(code:number):void {
        const eventFromBuffer:Optional<KeyBoardEvent> = this.findEvent(code);
        if (eventFromBuffer===undefined) return;
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

    private findEvent(key:number):Optional<KeyBoardEvent> {
        for (const event of this.buffer) {
            if (event.key===key) return event;
        }
        return undefined;
    }

    /**
     * this method register global keyboard event, if you need register event for scene, use scene.on()
     */
    // public on(e:KEYBOARD_EVENTS, callback:(e:KEYBOARD_KEY)=>any):void {
    //     this.emitter.on(e,callback);
    // }
    //
    // public off(e:KEYBOARD_EVENTS, callback:(arg?:any)=>void):void{
    //     this.emitter.off(e,callback);
    // }

}
