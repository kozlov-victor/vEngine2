import {EventEmitter} from "@engine/misc/eventEmitter";
import {IEventemittable} from "@engine/core/declarations";
import {Game} from "@engine/core/game";


export const getControlErrorMessage = (controlName:string,controlClassName:string):string=>{
    if (!DEBUG) return '';
    return `can not listen to ${controlName} events: ${controlName} control is not added;\ninvoke "game.addControl(${controlClassName});"`;
};


export class EventEmitterDelegate<T extends string, U> implements IEventemittable {

    private _emitter:EventEmitter;

    constructor(protected game:Game){}

    public on(eventName:T,callBack:(arg:U)=>void):(arg:U)=>void{
        if (this._emitter===undefined) this._emitter = new EventEmitter();
        this._emitter.on(eventName,callBack);
        return callBack;
    }
    public once(eventName:T,callBack:(arg:U)=>void):void {
        const cb = this.on(eventName,(_args)=>{
            this.off(eventName,cb);
            callBack(_args);
        });
    }
    public off(eventName:T,callBack?:(arg:U)=>void):void{
        if (this._emitter!==undefined)this._emitter.off(eventName,callBack);
    }
    public trigger(eventName:T,data:U):void{
        if (this._emitter!==undefined) this._emitter.trigger(eventName,data);
    }

}
