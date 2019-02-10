import {EventEmitter} from "@engine/core/misc/eventEmitter";



import {Game} from "../game";


declare const window:any;

export enum KEYBOARD_EVENT {
    KEY_PRESSED,
    KEY_RELEASED,
    KEY_HOLD
}

export enum KEY  {
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
    DOWN = 40,

    GAME_PAD_1 = 0,
    GAME_PAD_2 = 1,
    GAME_PAD_3 = 2,
    GAME_PAD_4 = 3,
    GAME_PAD_5 = 4,
    GAME_PAD_6 = 5,
    GAME_PAD_7 = 6,
    GAME_PAD_8 = 7,
    GAME_PAD_AXIS_LEFT = 8,
    GAME_PAD_AXIS_RIGHT = 9,
    GAME_PAD_AXIS_UP = 10,
    GAME_PAD_AXIS_DOWN = 11

}

enum KEY_STATE  {
    KEY_JUST_PRESSED = 2,
    KEY_PRESSED = 1,
    KEY_JUST_RELEASED = 0,
    KEY_RELEASED = -1
}

interface KeyboardBuffer {
    [key:number]:KEY_STATE
}

export class Keyboard {

    private keyDownListener:Function;
    private keyUpListener:Function;

    private buffer:KeyboardBuffer = {};
    private game:Game;
    private emitter = new EventEmitter();

    constructor(game:Game) {
        this.game = game;
    }

    press(key:number){
        if (this.isPressed(key)) return;
        //console.log('pressed',key);
        this.buffer[key] = KEY_STATE.KEY_JUST_PRESSED;
        this.emitter.trigger(KEYBOARD_EVENT[KEYBOARD_EVENT.KEY_PRESSED],key);
    }

    release(key:number){
        if (this.isReleased(key)) return;
        this.buffer[key] = KEY_STATE.KEY_JUST_RELEASED;
        this.emitter.trigger(KEYBOARD_EVENT[KEYBOARD_EVENT.KEY_RELEASED],this.buffer[key]);
    }

    on(e:KEYBOARD_EVENT,callback:(e:KEY)=>any) {
        this.emitter.on(KEYBOARD_EVENT[e],callback);
    }

    off(e:KEYBOARD_EVENT,callback:Function){
        this.emitter.off(KEY[e],callback);
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

    update(){
        Object.keys(this.buffer).forEach((key:string)=>{
            let keyNum:number = <number>(+key);
            if (this.buffer[keyNum]===KEY_STATE.KEY_RELEASED) delete this.buffer[keyNum];
            else if (this.buffer[keyNum]===KEY_STATE.KEY_JUST_RELEASED) this.buffer[keyNum] = KEY_STATE.KEY_RELEASED;
            if (this.buffer[keyNum]===KEY_STATE.KEY_JUST_PRESSED) {
                this.buffer[keyNum] = KEY_STATE.KEY_PRESSED;
            }
            this.emitter.trigger(KEYBOARD_EVENT[KEYBOARD_EVENT.KEY_HOLD],keyNum);
        });
    }

    listenTo(){

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

    destroy(){
        window.removeEventListener('keydown',this.keyDownListener);
        window.removeEventListener('keyup',this.keyUpListener);
    }

}