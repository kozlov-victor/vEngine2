import {DebugError} from "../debug/debugError";


interface IEventsHolder {
    [name:string]:((arg?:any)=>void)[];
}

export class EventEmitter{

    private events:IEventsHolder = {} as IEventsHolder;

    constructor(){

    }

    public on(eventNameOrList:string|string[],callBack:(arg?:any)=>void):void {
        if (typeof  eventNameOrList === 'string') {
            this._on(eventNameOrList,callBack);
        } else if (eventNameOrList.splice) {
            eventNameOrList.forEach((eventName:string)=>{
                this._on(eventName,callBack);
            });
        }

    }

    public off(eventName:string,callback:(arg?:any)=>void):void {
        const es:((arg?:any)=>void)[]  = this.events[eventName];
        if (!es) return;
        const index:number = es.indexOf(callback);
        if (DEBUG && index===-1) {
            console.error(callback);
            throw new DebugError(`can not remove event listener ${eventName}`);
        }
        es.splice(index,1);
    }

    public trigger(eventName:string,data:any):void {
        const es:((arg?:any)=>void)[] = this.events[eventName];
        if (!es) return;
        let l:number = es.length;
        while(l--){
            es[l](data);
        }
    }

    private _on(name:string,callBack:(arg?:any)=>void):void {
        this.events[name] = this.events[name] || [];
        this.events[name].push(callBack);
    }
}