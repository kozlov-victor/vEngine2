import {Game} from "@engine/core/game";
import {IControl} from "@engine/control/abstract/iControl";
import {AbstractKeypad, KEY_STATE} from "@engine/control/abstract/abstractKeypad";
import {Optional} from "@engine/core/declarations";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {GAME_PAD_EVENTS, GamePadEvent} from "@engine/control/gamepad/gamePadEvents";


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
const NullGamepadGetter:GamePadGetter = ():Gamepad[]=>[];

const gamePadGetterFactory = ():[GamePadGetter,boolean]=>{
    if (navigator.getGamepads) return [(()=>navigator.getGamepads()) as GamePadGetter,true];
    else if (navigator.webkitGetGamepads) return [(()=>navigator.webkitGetGamepads()) as GamePadGetter,true];
    else {
        const possibles:string[] = ['webkitGamepads','mozGamepads','msGamepads','msGamepads'];
        let possible:string = '';
        for (let i:number = 0; i < possibles.length; i++) {
            if ((navigator as unknown as INavigator)[possibles[i]]) {
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
                const axisLeftStick0:number = this.clampAxis(gp.axes[0]);
                const axisLeftStick1:number = this.clampAxis(gp.axes[1]);
                this.pollAxes(
                    axisLeftStick0,
                    axisLeftStick1,
                    GAME_PAD_BUTTON.STICK_L_LEFT,GAME_PAD_BUTTON.STICK_L_RIGHT,
                    GAME_PAD_BUTTON.STICK_L_UP, GAME_PAD_BUTTON.STICK_L_DOWN,
                    i
                );
            }

            if (gp.axes.length>=4) {
                const axisRightStick0:number = this.clampAxis(gp.axes[2]);
                const axisRightStick1:number = this.clampAxis(gp.axes[3]);
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


    private pressButton(buton:number,value:number,gamePadIndex:number,eventFromBuffer:Optional<GamePadEvent>) {
        if (eventFromBuffer===undefined) {
            const eventJustCreated:Optional<GamePadEvent> = GamePadEvent.fromPool();
            if (eventJustCreated===undefined) {
                if (DEBUG) console.warn('gamepad pool is full');
                return;
            }

            eventJustCreated.button = buton;
            eventJustCreated.gamePadIndex = gamePadIndex;
            eventJustCreated.value = value;
            this.press(eventJustCreated);
        } else {
            eventFromBuffer.value = value;
        }
    }


    private releaseButton(eventFromBuffer:Optional<GamePadEvent>){
        if (eventFromBuffer!==undefined) {
            if (!this.isReleased(eventFromBuffer)) this.release(eventFromBuffer);
        }
    }


    private pollButtons(gp:Gamepad,gamePadIndex:number):void {
        const maxButtons:number = gp.buttons.length;
        for (let i:number=0;i<maxButtons;i++) {
            const btn: GamepadButton = gp.buttons[i];

            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(i, gamePadIndex);
            if (btn.pressed) this.pressButton(i, btn.value, gamePadIndex, eventFromBuffer);
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

        if (axis0>0) {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnRight, gamePadIndex);
            this.pressButton(btnRight,axis0,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnRight, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }
        if (axis0<0) {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnLeft, gamePadIndex);
            this.pressButton(btnLeft,axis0,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnLeft, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }

        if (axis1>0) {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnDown, gamePadIndex);
            this.pressButton(btnDown,axis1,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnDown, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }
        if (axis1<0) {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnUp, gamePadIndex);
            this.pressButton(btnUp,axis1,gamePadIndex,eventFromBuffer);
        } else {
            const eventFromBuffer: Optional<GamePadEvent> = this.findEvent(btnUp, gamePadIndex);
            this.releaseButton(eventFromBuffer);
        }
    }


    private isReleased(e:GamePadEvent):boolean{
        return e.keyState===KEY_STATE.KEY_RELEASED || e.keyState===KEY_STATE.KEY_JUST_RELEASED;
    }

    private findEvent(button:number,gamePadIndex:number):Optional<GamePadEvent> {
        for (const event of this.buffer) {
            if (event.button===button && event.gamePadIndex === gamePadIndex) return event;
        }
        return undefined;
    }

    private clampAxis(val:number):number{
        if (Math.abs(val)<AXIS_THRESHOLD) return 0;
        return val;
    }

}