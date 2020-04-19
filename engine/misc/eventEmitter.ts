import {DebugError} from "../debug/debugError";


interface IEventsHolder {
    [name:string]:((arg?:unknown)=>void)[];
}

export class EventEmitter{

    private events:IEventsHolder = {} as IEventsHolder;

    constructor(){

    }

    public on(eventNameOrList:string|string[],callBack:(arg?:unknown)=>void):void {
        if (typeof  eventNameOrList === 'string') {
            this._on(eventNameOrList,callBack);
        } else if (eventNameOrList.splice!==undefined) {
            eventNameOrList.forEach((eventName:string)=>{
                this._on(eventName,callBack);
            });
        }

    }

    public off(eventName:string,callback:(arg?:unknown)=>void):void {
        const es:((arg?:unknown)=>void)[]  = this.events[eventName];
        if (!es) return;
        const index:number = es.indexOf(callback);
        if (DEBUG && index===-1) {
            console.error(callback);
            throw new DebugError(`can not remove event listener ${eventName}`);
        }
        es.splice(index,1);
    }

    public trigger(eventName:string,data:unknown):void {
        const evnts:((arg?:unknown)=>void)[] = this.events[eventName];
        if (!evnts) return;
        let l:number = evnts.length;
        while(l--){
            if (evnts[l]!==undefined) evnts[l](data);
        }
    }

    private _on(name:string,callBack:(arg?:unknown)=>void):void {
        this.events[name] = this.events[name] || [];
        this.events[name].push(callBack);
    }
}
