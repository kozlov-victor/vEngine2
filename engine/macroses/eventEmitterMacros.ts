import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";
import {DebugError} from "@engine/debugError";
import {EventEmitter} from "@engine/core/misc/eventEmitter";
import {Game} from "@engine/core/game";

class EventEmitterMacros {

    private game:Game;

    /// #MACROS_BODY_BEGIN
    private _emitter:EventEmitter;
    on(eventName:string,callBack:Function){

        if (DEBUG && !this.game.hasControl('Mouse')) {
            if (MOUSE_EVENTS[eventName]!=undefined) {
                throw new DebugError('can not listen mouse events: mouse control is not added');
            }
        }

        if (this._emitter===undefined) this._emitter = new EventEmitter();
        this._emitter.on(eventName,callBack);
        return callBack;
    }
    off(eventName:string,callBack:Function){
        if (this._emitter!==undefined)this._emitter.off(eventName,callBack);
    }
    trigger(eventName:string,data?:any){
        if (this._emitter!==undefined) this._emitter.trigger(eventName,data);
    }
    /// #MACROS_BODY_END

}