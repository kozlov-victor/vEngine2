import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";


export class KeyboardControl extends AbstractKeypad implements IControl {

    public readonly type:string = 'KeyboardControl';

    protected keyPressed: string = KEYBOARD_EVENTS.keyPressed;
    protected keyHold: string = KEYBOARD_EVENTS.keyHold;
    protected keyReleased: string = KEYBOARD_EVENTS.keyReleased;

    private keyDownListener:(e:KeyboardEvent)=>void;
    private keyUpListener:(e:KeyboardEvent)=>void;



    public listenTo():void {

        this.keyDownListener = (e:KeyboardEvent)=>{
            e.preventDefault();
            e.stopPropagation(); // to prevent page scroll
            const code:number = e.keyCode;
            if (this.isPressed(code)) return; // keyboard generate repeated events when key is pressed - ignore it
            try {
                const engineEvent:KeyBoardEvent = KeyBoardEvent.fromPool();
                engineEvent.key = code;
                this.press(code,engineEvent);
            } catch(er)  {
                console.log(this.buffer.getKeys());
                throw er;
            }

        };

        this.keyUpListener  = (e:KeyboardEvent)=>{
            const code:number = e.keyCode;
            const engineEvent:KeyBoardEvent = this.getEvent(code) as KeyBoardEvent;
            if (engineEvent===null) return;
            this.release(code,engineEvent);
        };

        globalThis.addEventListener('keydown',this.keyDownListener);
        globalThis.addEventListener('keyup',this.keyUpListener);
    }

    public destroy():void{
        globalThis.removeEventListener('keydown',this.keyDownListener);
        globalThis.removeEventListener('keyup',this.keyUpListener);
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