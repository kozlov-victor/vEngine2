import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugError} from "@engine/debug/debugError";
import {EventEmitter} from "@engine/misc/eventEmitter";
import {Game} from "@engine/core/game";

export class EventEmitterDelegate {

    private _emitter:EventEmitter;

    constructor(){}

    public on(eventName:string,callBack:()=>void):()=>void{

        if (DEBUG && !Game.getInstance().hasControl('MouseControl')) {
            if (eventName in MOUSE_EVENTS) {
                throw new DebugError('can not listen mouse events: mouse control is not added');
            }
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