import {EventEmitter} from "@engine/misc/eventEmitter";
import {Game} from "@engine/core/game";


export const getControlErrorMessage = (controlName:string,controlClassName:string):string=>{
    if (!DEBUG) return '';
    return `can not listen to ${controlName} events: ${controlName} control is not added;\ninvoke "game.addControl(${controlClassName});"`;
};


export class EventEmitterDelegate<T extends number, U> {

    private _emitter:EventEmitter;

    constructor(protected game:Game){}

    public on(event:T,callBack:(arg:U)=>void):(arg:U)=>void{
        if (this._emitter===undefined) this._emitter = new EventEmitter();
        this._emitter.on(event,callBack);
        return callBack;
    }
    public once(event:T,callBack:(arg:U)=>void):void {
        const cb = this.on(event,(_args)=>{
            this.off(event,cb);
            callBack(_args);
        });
    }
    public off(event:T,callBack?:(arg:U)=>void):void{
        if (this._emitter!==undefined)this._emitter.off(event,callBack);
    }
    public trigger(event:T,data:U):void{
        if (this._emitter!==undefined) this._emitter.trigger(event,data);
    }

}
