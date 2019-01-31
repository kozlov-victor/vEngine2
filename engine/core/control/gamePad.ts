import {KEY} from "@engine/core/control/keyboard";

import {Game} from "../game";

declare const window:any,navigator:any;

interface GamePadButton {
    pressed:boolean,
    value:number
}

interface GamePadInfo {
    index:number,
    id:number,
    buttons:Array<GamePadButton>,
    axes:Array<number>
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

export class GamePad {

    private game:Game;
    private gamepads:Array<GamePadInfo>;

    constructor(game:Game){
        this.game = game;
    }

    update(){

        this.gamepads = // todo remove from runtime
            (navigator.getGamepads && navigator.getGamepads()) ||
            (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
            navigator.webkitGamepads || navigator.mozGamepads ||
            navigator.msGamepads || navigator.gamepads || [] as Array<GamePadInfo>;

        for (let i=0,max=this.gamepads.length;i<max;i++) {
            let gp:GamePadInfo = this.gamepads[i];
            if (!gp) continue;
            let maxButtons = gp.buttons.length;
            if (maxButtons>7) maxButtons = 7; // only 8-buttons gamePad is supported for now
            for (let j=0;j<maxButtons;j++) {
                let btn = gp.buttons[j];
                if (btn.pressed) {
                    this.game.keyboard.press(j);
                } else {
                    this.game.keyboard.release(j);
                }
            }
            if (gp.axes[0]===0) continue; // to avoid oscillations, skip integer zero value
            if (gp.axes[1]===0) continue;

            let axis0 = ~~(gp.axes[0]);
            let axis1 = ~~(gp.axes[1]);

            if (axis0===1) {
                this.game.keyboard.press(KEY.GAME_PAD_AXIS_RIGHT);
            } else {
                this.game.keyboard.release(KEY.GAME_PAD_AXIS_RIGHT);
            }
            if (axis0===-1) {
                this.game.keyboard.press(KEY.GAME_PAD_AXIS_LEFT);
            } else {
                this.game.keyboard.release(KEY.GAME_PAD_AXIS_LEFT);
            }

            if (axis1===1) {
                this.game.keyboard.press(KEY.GAME_PAD_AXIS_DOWN);
            } else {
                this.game.keyboard.release(KEY.GAME_PAD_AXIS_DOWN);
            }
            if (axis1===-1) {
                this.game.keyboard.press(KEY.GAME_PAD_AXIS_UP);
            } else {
                this.game.keyboard.release(KEY.GAME_PAD_AXIS_UP);
            }
        }
    }

}