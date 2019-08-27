import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugError} from "@engine/debug/debugError";
import {EventEmitter} from "@engine/misc/eventEmitter";
import {Game} from "@engine/core/game";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";


const getControlErrorMessage = (controlName:string,controlClassName:string):string=>{
    if (!DEBUG) return '';
    return `can not listen ${controlName} events: ${controlName} control is not added;\ninvoke "game.addControl(${controlClassName});"`;
};


export class EventEmitterDelegate {

    private _emitter:EventEmitter;

    constructor(){}

    public on(eventName:string,callBack:()=>void):()=>void{

        if (DEBUG && eventName in MOUSE_EVENTS) {
            if (!Game.getInstance().hasControl('MouseControl'))
                throw new DebugError(getControlErrorMessage('mouse','MouseControl'));
        }

        if (DEBUG && eventName in GAME_PAD_EVENTS) {
            if (!Game.getInstance().hasControl('GamePadControl'))
                throw new DebugError(getControlErrorMessage('gamepad','GamePadControl'));
        }

        if (DEBUG && eventName in KEYBOARD_EVENTS) {
            if (!Game.getInstance().hasControl('KeyboardControl'))
                throw new DebugError(getControlErrorMessage('keyboard','KeyboardControl'));
        }

        if (this._emitter===undefined) this._emitter = new EventEmitter();
        this._emitter.on(eventName,callBack);
        return callBack;
    }
    public off(eventName:string,callBack:(arg?:any)=>void):void{
        if (this._emitter!==undefined)this._emitter.off(eventName,callBack);
    }
    public trigger(eventName:string,data?:any):void{
        if (this._emitter!==undefined) this._emitter.trigger(eventName,data);
    }

}