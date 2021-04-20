import {DebugError} from "../debug/debugError";


interface IEventsHolder {
    [name:string]:((arg?:unknown)=>void)[];
}

export class EventEmitter{

    private _events:IEventsHolder = {} as IEventsHolder;

    constructor(){

    }

    public on(eventNameOrList:string|string[],callBack:(arg?:any)=>void):void {
        if (typeof  eventNameOrList === 'string') {
            this._on(eventNameOrList,callBack);
        } else if (eventNameOrList.splice!==undefined) {
            eventNameOrList.forEach((eventName:string)=>{
                this._on(eventName,callBack);
            });
        }

    }

    public off(eventName:string,callback?:(arg?:any)=>void):void {
        if (callback===undefined) {
            if (this._events[eventName]!==undefined) this._events[eventName].length = 0;
        } else {
            const es:((arg?:unknown)=>void)[]  = this._events[eventName];
            if (!es) return;
            const index:number = es.indexOf(callback);
            if (DEBUG && index===-1) {
                console.error(callback);
                throw new DebugError(`can not remove event listener ${eventName}, it does not belong to this eventEmitter`);
            }
            es.splice(index,1);
        }
    }

    public trigger(eventName:string,data:unknown):void {
        const evnts:((arg?:unknown)=>void)[] = this._events[eventName];
        if (!evnts) return;
        for (let i:number=0;i<evnts.length;i++) {
            evnts[i](data);
        }
    }

    private _on(name:string,callBack:(arg?:unknown)=>void):void {
        this._events[name] ??= [];
        this._events[name].push(callBack);
    }
}
