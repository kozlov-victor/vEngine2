import {Game} from "@engine/game";
import {EventEmitter} from "@engine/misc/eventEmitter";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}

interface KeyboardBuffer {
    [key:number]:KEY_STATE
}


export abstract class AbstractKeypad {

    private buffer:KeyboardBuffer = {};
    protected game:Game;
    protected emitter = new EventEmitter();

    constructor(game:Game) {
        this.game = game;
    }

    press(key:number):void{
        if (this.isPressed(key)) return;
        this.buffer[key] = KEY_STATE.KEY_JUST_PRESSED;
        this.emitter.trigger(KEYBOARD_EVENTS[KEYBOARD_EVENTS.KEY_PRESSED],key);
    }

    release(key:number):void{
        if (this.isReleased(key)) return;
        this.buffer[key] = KEY_STATE.KEY_JUST_RELEASED;
        this.emitter.trigger(KEYBOARD_EVENTS[KEYBOARD_EVENTS.KEY_RELEASED],this.buffer[key]);
    }

    isPressed(key:number):boolean{
        return this.buffer[key]>=KEY_STATE.KEY_PRESSED;
    }

    isJustPressed(key:number):boolean{
        return this.buffer[key]===KEY_STATE.KEY_JUST_PRESSED;
    }

    isReleased(key:number):boolean{
        if (this.buffer[key]===undefined) return true;
        return  this.buffer[key]<=KEY_STATE.KEY_JUST_RELEASED;
    }

    isJustReleased(key:number):boolean {
        return this.buffer[key] === KEY_STATE.KEY_JUST_RELEASED;
    }

    update():void{
        Object.keys(this.buffer).forEach((key:string)=>{
            const keyNum:number = (+key) as number;
            if (this.buffer[keyNum]===KEY_STATE.KEY_RELEASED) delete this.buffer[keyNum];
            else if (this.buffer[keyNum]===KEY_STATE.KEY_JUST_RELEASED) this.buffer[keyNum] = KEY_STATE.KEY_RELEASED;
            if (this.buffer[keyNum]===KEY_STATE.KEY_JUST_PRESSED) {
                this.buffer[keyNum] = KEY_STATE.KEY_PRESSED;
            }
            this.emitter.trigger(KEYBOARD_EVENTS[KEYBOARD_EVENTS.KEY_HOLD],keyNum);
        });
    }

}