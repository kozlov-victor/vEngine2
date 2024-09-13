import {DebugError} from "../debug/debugError";

export class EventEmitter{

    private _events = new Map<string|number,((arg?:unknown)=>void)[]>;

    constructor(){

    }

    public on(name:number,callBack:(arg?:any)=>void):void {
        if (!this._events.has(name)) {
            this._events.set(name,[]);
        }
        this._events.get(name)!.push(callBack);
    }

    public off(name:number,callback?:(arg?:any)=>void):void {
        if (callback===undefined) {
            this._events.delete(name);
        } else {
            const events  = this._events.get(name);
            if (!events) return;
            const index = events.indexOf(callback);
            if (DEBUG && index===-1) {
                console.error(callback);
                throw new DebugError(`can not remove event listener ${name}, it does not belong to this eventEmitter`);
            }
            events.splice(index,1);
        }
    }

    public trigger(name:number,data:unknown):void {
        const events = this._events.get(name);
        if (!events) return;
        for (let i=0;i<events.length;i++) {
            events[i](data);
        }
    }
}
