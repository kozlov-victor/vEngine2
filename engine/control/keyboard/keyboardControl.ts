import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad, KEY_STATE} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {Optional} from "@engine/core/declarations";


export class KeyboardControl extends AbstractKeypad implements IControl {

    public readonly type:string = 'KeyboardControl';

    protected keyPressed: string = KEYBOARD_EVENTS.keyPressed;
    protected keyHold: string = KEYBOARD_EVENTS.keyHold;
    protected keyReleased: string = KEYBOARD_EVENTS.keyReleased;

    protected buffer:KeyBoardEvent[];

    private keyDownListener:(e:KeyboardEvent)=>void;
    private keyUpListener:(e:KeyboardEvent)=>void;

    public isPressed(key:number):boolean{
        const event:Optional<KeyBoardEvent> = this.findEvent(key);
        if (event===undefined) return false;
        return event.keyState>=KEY_STATE.KEY_PRESSED;
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

        this.keyDownListener = (e:KeyboardEvent)=>{
            e.preventDefault();
            e.stopPropagation(); // to prevent page scroll
            const code:number = e.keyCode;
            if (this.isPressed(code)) return; // keyboard generate repeated events when key is pressed - ignore it

            const eventFromBuffer:Optional<KeyBoardEvent> = KeyBoardEvent.fromPool();
            if (eventFromBuffer===undefined) {
                if (DEBUG) console.warn('keyboard pool is full');
                return;
            }
            eventFromBuffer.key = code;
            this.press(eventFromBuffer);

        };

        this.keyUpListener  = (e:KeyboardEvent)=>{
            const code:number = e.keyCode;
            const eventFromBuffer:Optional<KeyBoardEvent> = this.findEvent(code);
            if (eventFromBuffer===undefined) return;
            this.release(eventFromBuffer);
        };

        globalThis.addEventListener('keydown',this.keyDownListener);
        globalThis.addEventListener('keyup',this.keyUpListener);
    }

    public destroy():void{
        globalThis.removeEventListener('keydown',this.keyDownListener);
        globalThis.removeEventListener('keyup',this.keyUpListener);
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