import {Game} from "@engine/core/game";
import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad, KEY_STATE} from "@engine/control/abstract/abstractKeypad";
import {Optional} from "@engine/core/declarations";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {GamePadEvent} from "@engine/control/gamepad/gamePadEvents";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

// g.vibrationActuator.playEffect("dual-rumble", {
//     duration: 100,
//     strongMagnitude: 1.0,
//     weakMagnitude: 1.0
// });

interface IWindow {
    addEventListener: (cmg:string,cb:(e:IGamePadEvent)=>void)=>void;
}

interface IGamePadEvent {
    gamepad:Gamepad;
}

interface INavigator extends Record<string,unknown>{
    getGamepads:()=>Gamepad[];
    webkitGetGamepads:()=>void;
}

const navigator = window.navigator as unknown as INavigator;

const AXIS_THRESHOLD = 0.005 as const;

if (DEBUG) {
    (window as unknown as IWindow).addEventListener("gamepadconnected",(e:IGamePadEvent)=>{
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    (window as unknown as IWindow).addEventListener("gamepaddisconnected", (e:IGamePadEvent) => {
        console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
    });
}

type GamePadGetter = ()=>Gamepad[];
const EMPTY_ARR:Gamepad[] = [];
const NullGamepadGetter:GamePadGetter = ():Gamepad[]=>EMPTY_ARR;

const gamePadGetterFactory = ():[GamePadGetter,boolean]=>{
    if (navigator.getGamepads) return [(()=>navigator.getGamepads()) as GamePadGetter,true];
    else if (navigator.webkitGetGamepads) return [(()=>navigator.webkitGetGamepads()) as GamePadGetter,true];
    else {
        const possibleProperties:string[] = ['webkitGamepads','mozGamepads','msGamepads'];
        let possible:string = '';
        for (let i:number = 0; i < possibleProperties.length; i++) {
            if ((navigator as unknown as INavigator)[possibleProperties[i]]) {
                possible = possibleProperties[i];
                if (DEBUG) console.log(`gamepad control with prefix is used (${possible})`);
                break;
            }
        }
        if (!possible) return [NullGamepadGetter,false];
        else return [(()=>navigator[possible]) as GamePadGetter,true];
    }
};

const [gamePadGetter,isEnabled] = gamePadGetterFactory();

// https://www.w3.org/TR/gamepad/
export class GamePadControl extends AbstractKeypad<GamePadEvent> implements IControl{


    constructor(game:Game){
        super(game);
    }

    public enabled = isEnabled;

    public static SENSITIVITY = 0.05;

    public override readonly type = 'GamePadControl';

    declare protected buffer:GamePadEvent[];

    private _gamepads:Gamepad[];

    protected recycleEvent(e: GamePadEvent): void {
        GamePadEvent.pool.recycle(e);
    }

    private static isReleased(e:GamePadEvent):boolean{
        return e.keyState===KEY_STATE.KEY_RELEASED || e.keyState===KEY_STATE.KEY_JUST_RELEASED;
    }

    private static clampAxis(val:number):number{
        if (Math.abs(val)<AXIS_THRESHOLD) return 0;
        return val;
    }

    public override update():void{
        if (!this.enabled) return;

        super.update();

        this._gamepads = gamePadGetter();

        for (let i:number=0,max=this._gamepads.length;i<max;i++) {
            const gp:Gamepad = this._gamepads[i];

            if (!gp) continue;

            this.pollButtons(gp,i);

            if (gp.axes.length>=2) {
                const axisLeftStick0 = GamePadControl.clampAxis(gp.axes[0]);
                const axisLeftStick1 = GamePadControl.clampAxis(gp.axes[1]);
                this.pollAxes(
                    axisLeftStick0,
                    axisLeftStick1,
                    GAME_PAD_BUTTON.STICK_L_LEFT,GAME_PAD_BUTTON.STICK_L_RIGHT,
                    GAME_PAD_BUTTON.STICK_L_UP, GAME_PAD_BUTTON.STICK_L_DOWN,
                    i
                );
            }

            if (gp.axes.length>=4) {
                const axisRightStick0 = GamePadControl.clampAxis(gp.axes[2]);
                const axisRightStick1 = GamePadControl.clampAxis(gp.axes[3]);
                this.pollAxes(
                    axisRightStick0,
                    axisRightStick1,
                    GAME_PAD_BUTTON.STICK_R_LEFT,GAME_PAD_BUTTON.STICK_R_RIGHT,
                    GAME_PAD_BUTTON.STICK_R_UP, GAME_PAD_BUTTON.STICK_R_DOWN,
                    i
                );
            }

        }
    }


    public listenTo():void {}

    public destroy():void {}

    protected override notify(eventName: KEYBOARD_EVENTS, e: GamePadEvent): void {
        super.notify(eventName,e);
        this.game.getCurrentScene().gamepadEventHandler.trigger(eventName,e);
    }

    private pressButton(button:number,value:number,gamePadIndex:number,eventFromBuffer:Optional<GamePadEvent>):void {
        if (eventFromBuffer===undefined) {
            const eventJustCreated = GamePadEvent.pool.get();

            eventJustCreated.button = button;
            eventJustCreated.gamePadIndex = gamePadIndex;
            eventJustCreated.value = value;
            this.press(eventJustCreated);
        } else {
            eventFromBuffer.value = value;
        }
    }


    private releaseButton(eventFromBuffer:Optional<GamePadEvent>):void{
        if (eventFromBuffer!==undefined) {
            if (!GamePadControl.isReleased(eventFromBuffer)) this.release(eventFromBuffer);
        }
    }


    private pollButtons(gp:Gamepad,gamePadIndex:number):void {
        const maxButtons = gp.buttons.length;
        for (let i=0;i<maxButtons;i++) {
            const btn = gp.buttons[i];

            const eventFromBuffer = this.findEvent(i, gamePadIndex);
            if (btn.pressed) {
                this.pressButton(i, btn.value, gamePadIndex, eventFromBuffer);
            }
            else this.releaseButton(eventFromBuffer);

        }
    }

    private pollAxes(
        axis0:number,
        axis1:number,
        btnLeft:GAME_PAD_BUTTON,
        btnRight:GAME_PAD_BUTTON,
        btnUp:GAME_PAD_BUTTON,
        btnDown:GAME_PAD_BUTTON,
        gamePadIndex:number,
    ):void {

        if (Math.abs(axis0)<GamePadControl.SENSITIVITY) axis0 = 0;
        if (Math.abs(axis1)<GamePadControl.SENSITIVITY) axis1 = 0;

        if (axis0>0) {
            const eventFromBuffer = this.findEvent(btnRight, gamePadIndex);
            this.pressButton(btnRight,axis0,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer = this.findEvent(btnRight, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }
        if (axis0<0) {
            const eventFromBuffer = this.findEvent(btnLeft, gamePadIndex);
            this.pressButton(btnLeft,axis0,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer = this.findEvent(btnLeft, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }

        if (axis1>0) {
            const eventFromBuffer = this.findEvent(btnDown, gamePadIndex);
            this.pressButton(btnDown,axis1,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer = this.findEvent(btnDown, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }
        if (axis1<0) {
            const eventFromBuffer = this.findEvent(btnUp, gamePadIndex);
            this.pressButton(btnUp,axis1,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer = this.findEvent(btnUp, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }

    }

    private findEvent(button:number,gamePadIndex:number):Optional<GamePadEvent> {
        for (const event of this.buffer) {
            if (event.button===button && event.gamePadIndex === gamePadIndex) return event;
        }
        return undefined;
    }

}
