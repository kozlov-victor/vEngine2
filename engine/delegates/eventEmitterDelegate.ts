import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugError} from "@engine/debug/debugError";
import {EventEmitter} from "@engine/misc/eventEmitter";
import {Game} from "@engine/game";

export class EventEmitterDelegate {

    constructor(){}

    private _emitter:EventEmitter;

    on(eventName:string,callBack:Function):Function{

        if (DEBUG && !Game.getInstance().hasControl('MouseControl')) {
            if (!(eventName in MOUSE_EVENTS)) {
                throw new DebugError('can not listen mouse events: mouse control is not added');
            }
        }

        if (this._emitter===undefined) this._emitter = new EventEmitter();
        this._emitter.on(eventName,callBack);
        return callBack;
    }
    off(eventName:string,callBack:Function):void{
        if (this._emitter!==undefined)this._emitter.off(eventName,callBack);
    }
    trigger(eventName:string,data?:any):void{
        if (this._emitter!==undefined) this._emitter.trigger(eventName,data);
    }

}