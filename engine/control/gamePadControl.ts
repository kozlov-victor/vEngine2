import {Game} from "../core/game";
import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad} from "@engine/control/abstract/abstractKeypad";
import {Int} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

declare const window:any,navigator:any;


interface IGamePadEvent {
    gamepad:Gamepad;
}


if (DEBUG) {
    window.addEventListener("gamepadconnected",(e:IGamePadEvent)=>{
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    window.addEventListener("gamepaddisconnected", (e:IGamePadEvent) => {
        console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
    });
}

export const enum GAME_PAD_KEY {
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

type GamePadGetter = ()=>Gamepad[];

const gamePadGetterFactory = ():GamePadGetter=>{
    if (navigator.getGamepads) return (()=>navigator.getGamepads()) as GamePadGetter;
    else if (navigator.webkitGetGamepads) return (()=>navigator.webkitGetGamepads()) as GamePadGetter;
    else {
        const possibles:string[] = ['webkitGamepads','mozGamepads','msGamepads','msGamepads'];
        let possible:string;
        for (let i:number = 0; i < possibles.length; i++) {
            if (navigator[possibles[i]]) {
                possible = possibles[i];
                break;
            }
        }
        if (DEBUG && !possible) throw new DebugError(`can not use game pad: it is not supported by this device`);
        return (()=>navigator[possible]) as GamePadGetter;
    }
};

const gamePadGetter:GamePadGetter = gamePadGetterFactory();

export class GamePadControl extends AbstractKeypad implements IControl{

    public readonly type:string = 'GamePadControl';
    private gamepads:Gamepad[];

    constructor(game:Game){
        super(game);
    }

    public update(){

        super.update();

        this.gamepads = gamePadGetter();

        for (let i:number=0,max=this.gamepads.length;i<max;i++) {
            const gp:Gamepad = this.gamepads[i];
            if (!gp) continue;
            let maxButtons:number = gp.buttons.length;
            if (maxButtons>8) maxButtons = 8; // only 8-buttons gamePad is supported for now
            for (let j:number=0;j<maxButtons;j++) {
                const btn:GamepadButton = gp.buttons[j];
                if (btn.pressed) {
                    this.press(j);
                } else {
                    this.release(j);
                }
            }
            if (gp.axes[0]===0) continue; // to avoid oscillations, skip integer zero value
            if (gp.axes[1]===0) continue;

            const axis0:Int = ~~(gp.axes[0]) as Int;
            const axis1:Int = ~~(gp.axes[1]) as Int;

            if (axis0===1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_RIGHT);
            } else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_RIGHT);
            }
            if (axis0===-1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_LEFT);
            } else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_LEFT);
            }

            if (axis1===1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_DOWN);
            } else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_DOWN);
            }
            if (axis1===-1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_UP);
            } else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_UP);
            }
        }
    }


    public listenTo():void {}

    public destroy():void {}

}