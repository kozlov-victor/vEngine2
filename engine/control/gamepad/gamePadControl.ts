import {Game} from "@engine/core/game";
import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad} from "@engine/control/abstract/abstractKeypad";
import {Int} from "@engine/core/declarations";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {GAME_PAD_EVENTS, GamePadEvent} from "@engine/control/gamepad/gamePadEvents";

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

type GamePadGetter = ()=>Gamepad[];
const NullGamepadGetter:GamePadGetter = ():Gamepad[]=>[];

const gamePadGetterFactory = ():[GamePadGetter,boolean]=>{
    if (navigator.getGamepads) return [(()=>navigator.getGamepads()) as GamePadGetter,true];
    else if (navigator.webkitGetGamepads) return [(()=>navigator.webkitGetGamepads()) as GamePadGetter,true];
    else {
        const possibles:string[] = ['webkitGamepads','mozGamepads','msGamepads','msGamepads'];
        let possible:string = '';
        for (let i:number = 0; i < possibles.length; i++) {
            if (navigator[possibles[i]]) {
                possible = possibles[i];
                if (DEBUG) console.log(`gamepad control with prefix is used (${possible})`);
                break;
            }
        }
        if (DEBUG && !possible) return [NullGamepadGetter,false];
        return [(()=>navigator[possible]) as GamePadGetter,false];
    }
};

const [gamePadGetter,isEnabled] = gamePadGetterFactory();

// https://www.w3.org/TR/gamepad/
export class GamePadControl extends AbstractKeypad implements IControl{

    public static readonly enabled:boolean = isEnabled;

    public readonly type:string = 'GamePadControl';

    protected keyPressed: string = GAME_PAD_EVENTS.buttonPressed;
    protected keyHold: string = GAME_PAD_EVENTS.buttonHold;
    protected keyReleased: string = GAME_PAD_EVENTS.buttonReleased;


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

            this.pollButtons(gp);

            if (gp.axes.length>=2) {
                const axisLeftStick0:Int = ~~(gp.axes[0]) as Int;
                const axisLeftStick1:Int = ~~(gp.axes[1]) as Int;
                this.pollAxes(
                    axisLeftStick0,
                    axisLeftStick1,
                    GAME_PAD_BUTTON.STICK_L_LEFT,GAME_PAD_BUTTON.STICK_L_RIGHT,
                    GAME_PAD_BUTTON.STICK_L_UP, GAME_PAD_BUTTON.STICK_L_DOWN,
                );
            }

            if (gp.axes.length>=4) {
                const axisRightStick0:Int = ~~(gp.axes[2]) as Int;
                const axisRightStick1:Int = ~~(gp.axes[3]) as Int;
                this.pollAxes(
                    axisRightStick0,
                    axisRightStick1,
                    GAME_PAD_BUTTON.STICK_R_LEFT,GAME_PAD_BUTTON.STICK_R_RIGHT,
                    GAME_PAD_BUTTON.STICK_R_UP, GAME_PAD_BUTTON.STICK_R_DOWN,
                );
            }

        }
    }


    public listenTo():void {}

    public destroy():void {}

    private pollButtons(gp:Gamepad):void {
        const maxButtons:number = gp.buttons.length;
        for (let j:number=0;j<maxButtons;j++) {
            const btn:GamepadButton = gp.buttons[j];
            const engineEvent:GamePadEvent = GamePadEvent.fromPool();
            engineEvent.button = j;
            if (btn.pressed) {
                this.press(j,engineEvent);
            } else {
                this.release(j,engineEvent);
            }
            engineEvent.release();
        }
    }

    private pollAxes(
        axis0:Int,
        axis1:Int,
        btnLeft:GAME_PAD_BUTTON,
        btnRight:GAME_PAD_BUTTON,
        btnUp:GAME_PAD_BUTTON,
        btnDown:GAME_PAD_BUTTON
    ):void {

        const engineEvent:GamePadEvent = GamePadEvent.fromPool();

        if (axis0>0) {
            engineEvent.button = btnRight;
            this.press(btnRight,engineEvent);
        } else {
            engineEvent.button = btnRight;
            this.release(btnRight,engineEvent);
        }
        if (axis0<0) {
            engineEvent.button = btnLeft;
            this.press(btnLeft,engineEvent);
        } else {
            engineEvent.button = btnLeft;
            this.release(btnLeft,engineEvent);
        }

        if (axis1>0) {
            engineEvent.button = btnDown;
            this.press(btnDown,engineEvent);
        } else {
            engineEvent.button = btnDown;
            this.release(btnDown,engineEvent);
        }
        if (axis1<0) {
            engineEvent.button = btnUp;
            this.press(btnUp,engineEvent);
        } else {
            engineEvent.button = btnUp;
            this.release(btnUp,engineEvent);
        }

        engineEvent.release();

    }

}