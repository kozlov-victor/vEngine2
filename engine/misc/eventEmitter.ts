import {DebugError} from "../debug/debugError";


interface EventsHolder {
    [name:string]:Function[]
}

export class EventEmitter{

    private events:EventsHolder = {};

    constructor(){

    }

    private _on(name:string,callBack:Function):void {
        this.events[name] = this.events[name] || [];
        this.events[name].push(callBack);
    }

    on(eventNameOrList:string|string[],callBack:Function):void {
        if (typeof  eventNameOrList === 'string') {
            this._on(eventNameOrList,callBack);
        } else if (eventNameOrList.splice) {
            eventNameOrList.forEach((eventName:string)=>{
                this._on(eventName,callBack);
            });
        }

    };

    off(eventName:string,callback:Function):void {
        const es:Function[] = this.events[eventName];
        if (!es) return;
        let index:number = es.indexOf(callback);
        if (DEBUG && index==-1) {
            console.error(callback);
            throw new DebugError(`can not remove event listener ${eventName}`);
        }
        es.splice(index,1);
    };

    trigger(eventName:string,data:any):void {
        const es:Function[] = this.events[eventName];
        if (!es) return;
        let l:number = es.length;
        while(l--){
            es[l](data);
        }
    };
}