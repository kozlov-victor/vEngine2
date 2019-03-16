
import {Game} from "../game";
import {IControl} from "@engine/core/control/abstract/iControl";
import {AbstractKeypad, KEYBOARD_EVENT} from "@engine/core/control/abstract/abstractKeypad";
import {KEYBOARD_KEY} from "@engine/core/control/keyboard";

declare const window:any,navigator:any;

interface GamePadButton {
    pressed:boolean,
    value:number
}

interface GamePadInfo {
    index:number,
    id:number,
    buttons:GamePadButton[],
    axes:number[]
}

interface GamePadEvent {
    gamepad:GamePadInfo
}


if (DEBUG) {
    window.addEventListener("gamepadconnected",(e:GamePadEvent)=>{
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    window.addEventListener("gamepaddisconnected", (e:GamePadEvent) => {
        console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
    });
}

export enum GAME_PAD_KEY {
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

export class GamePad extends AbstractKeypad implements IControl{

    readonly type:string = 'GamePad';
    private gamepads:GamePadInfo[];

    constructor(game:Game){
        super(game);
    }

    update(){

        this.gamepads = // todo remove from runtime
            (navigator.getGamepads && navigator.getGamepads()) ||
            (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
            navigator.webkitGamepads || navigator.mozGamepads ||
            navigator.msGamepads || navigator.gamepads || [] as GamePadInfo[];

        for (let i:number=0,max=this.gamepads.length;i<max;i++) {
            let gp:GamePadInfo = this.gamepads[i];
            if (!gp) continue;
            let maxButtons = gp.buttons.length;
            if (maxButtons>7) maxButtons = 7; // only 8-buttons gamePad is supported for now
            for (let j:number=0;j<maxButtons;j++) {
                let btn:GamePadButton = gp.buttons[j];
                if (btn.pressed) {
                    this.press(j);
                } else {
                    this.release(j);
                }
            }
            if (gp.axes[0]===0) continue; // to avoid oscillations, skip integer zero value
            if (gp.axes[1]===0) continue;

            let axis0 = ~~(gp.axes[0]);
            let axis1 = ~~(gp.axes[1]);

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


    on(e:KEYBOARD_EVENT,callback:(e:GAME_PAD_KEY)=>any) {
        this.emitter.on(KEYBOARD_EVENT[e],callback);
    }

    off(e:KEYBOARD_EVENT,callback:Function){
        this.emitter.off(GAME_PAD_KEY[e],callback);
    }


    listenTo(){}

    destroy(){}

}