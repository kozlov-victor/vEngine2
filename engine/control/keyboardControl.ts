import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";


declare const window:any;

export enum KEYBOARD_KEY  {
    SPACE = 32,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 80,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40

}


export class KeyboardControl extends AbstractKeypad implements IControl {

    readonly type:string = 'KeyboardControl';
    private keyDownListener:(e:KeyboardEvent)=>void;
    private keyUpListener:(e:KeyboardEvent)=>void;

    listenTo():void {

        this.keyDownListener = (e:KeyboardEvent)=>{
            let code = e.keyCode;
            this.press(code);
        };

        this.keyUpListener  = (e:KeyboardEvent)=>{
            let code = e.keyCode;
            this.release(code);
        };

        window.addEventListener('keydown',this.keyDownListener);
        window.addEventListener('keyup',this.keyUpListener);
    }

    destroy():void{
        window.removeEventListener('keydown',this.keyDownListener);
        window.removeEventListener('keyup',this.keyUpListener);
    }

    on(e:KEYBOARD_EVENTS, callback:(e:KEYBOARD_KEY)=>any):void {
        this.emitter.on(KEYBOARD_EVENTS[e],callback);
    }

    off(e:KEYBOARD_EVENTS, callback:Function):void{
        this.emitter.off(KEYBOARD_KEY[e],callback);
    }

}