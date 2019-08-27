import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad} from "@engine/control/abstract/abstractKeypad";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";


export const enum KEYBOARD_KEY  {
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

    public readonly type:string = 'KeyboardControl';
    private keyDownListener:(e:KeyboardEvent)=>void;
    private keyUpListener:(e:KeyboardEvent)=>void;

    public listenTo():void {

        this.keyDownListener = (e:KeyboardEvent)=>{
            e.preventDefault();
            e.stopPropagation(); // to prevent page scroll
            const code:number = e.keyCode;
            this.press(code);
        };

        this.keyUpListener  = (e:KeyboardEvent)=>{
            const code:number = e.keyCode;
            this.release(code);
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