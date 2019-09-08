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
    protected buffer:GamePadEvent[];

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

            this.pollButtons(gp,i);

            if (gp.axes.length>=2) {
                const axisLeftStick0:Int = ~~(gp.axes[0]) as Int;
                const axisLeftStick1:Int = ~~(gp.axes[1]) as Int;
                this.pollAxes(
                    axisLeftStick0,
                    axisLeftStick1,
                    GAME_PAD_BUTTON.STICK_L_LEFT,GAME_PAD_BUTTON.STICK_L_RIGHT,
                    GAME_PAD_BUTTON.STICK_L_UP, GAME_PAD_BUTTON.STICK_L_DOWN,
                    i
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
                    i
                );
            }

        }
    }


    public listenTo():void {}

    public destroy():void {}

    private pollButtons(gp:Gamepad,gamePadIndex:number):void {
        const maxButtons:number = gp.buttons.length;
        for (let i:number=0;i<maxButtons;i++) {
            const btn:GamepadButton = gp.buttons[i];

            const eventFromBuffer:Optional<GamePadEvent> = this.findEvent(i,gamePadIndex);

            if (btn.pressed) {
                if (eventFromBuffer===undefined) {
                    const eventJustCreated:Optional<GamePadEvent> = GamePadEvent.fromPool();
                    if (eventJustCreated===undefined) {
                        if (DEBUG) console.warn('gamepad pool is full');
                        return;
                    }

                    eventJustCreated.button = i;
                    eventJustCreated.gamePadIndex = gamePadIndex;

                    if (eventFromBuffer===undefined) {
                        this.press(eventJustCreated);
                    }

                }

            } else {
                if (eventFromBuffer!==undefined) {
                    console.log('try to release',eventFromBuffer.keyState);
                    this.release(eventFromBuffer);
                }
            }

        }
    }

    private pollAxes(
        axis0:Int,
        axis1:Int,
        btnLeft:GAME_PAD_BUTTON,
        btnRight:GAME_PAD_BUTTON,
        btnUp:GAME_PAD_BUTTON,
        btnDown:GAME_PAD_BUTTON,
        gamePadIndex:number,
    ):void {

        // const eventJustCreated:Optional<GamePadEvent> = GamePadEvent.fromPool();
        // if (eventJustCreated===undefined) {
        //     if (DEBUG) console.warn('gamepad pool is full');
        //     return;
        // }
        // eventJustCreated.gamePadIndex = gamePadIndex;
        // let eventIsUsed:boolean = false;
        //
        //
        // if (axis0>0) {
        //     eventJustCreated.button = btnRight;
        //     this.press(eventJustCreated);
        //     eventIsUsed = true;
        // } else {
        //     const eventFromBuffer:Optional<GamePadEvent> = this.findEvent(btnRight,gamePadIndex);
        //     if (eventFromBuffer!==undefined) this.release(eventJustCreated);
        // }
        // if (axis0<0) {
        //     eventJustCreated.button = btnLeft;
        //     this.press(eventJustCreated);
        //     eventIsUsed = true;
        // } else {
        //     const eventFromBuffer:Optional<GamePadEvent> = this.findEvent(btnLeft,gamePadIndex);
        //     if (eventFromBuffer!==undefined) this.release(eventJustCreated);
        // }
        //
        // if (axis1>0) {
        //     eventJustCreated.button = btnDown;
        //     this.press(eventJustCreated);
        //     eventIsUsed = true;
        // } else {
        //     const eventFromBuffer:Optional<GamePadEvent> = this.findEvent(btnDown,gamePadIndex);
        //     if (eventFromBuffer!==undefined) this.release(eventJustCreated);
        // }
        // if (axis1<0) {
        //     eventJustCreated.button = btnUp;
        //     this.press(eventJustCreated);
        //     eventIsUsed = true;
        // } else {
        //     const eventFromBuffer:Optional<GamePadEvent> = this.findEvent(btnUp,gamePadIndex);
        //     if (eventFromBuffer!==undefined) this.release(eventJustCreated);
        // }
        //
        // if (!eventIsUsed) eventJustCreated.release();

    }


    private findEvent(button:number,gamePadIndex:number):Optional<GamePadEvent> {
        for (const event of this.buffer) {
            if (event.button===button && event.gamePadIndex === gamePadIndex) return event;
        }
        return undefined;
    }

}