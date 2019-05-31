import {Timer} from "@engine/misc/timer";

export class TimerDelegate {

    private _timers: Timer[];

    public setInterval(callback:()=>void,interval:number):Timer{
        return this._addTimer(callback,interval,false);
    }

    public setTimeout(callback:()=>void,interval:number):Timer{
        return this._addTimer(callback,interval,true);
    }

    public getTimers():Timer[]{
        return this._timers;
    }

    public update(){
        if (!this._timers) return;
        for (const t of this._timers) {
            t.onUpdate();
        }
    }


    private _addTimer(callback:()=>void,interval:number,once:boolean):Timer{
        const t:Timer = new Timer(this,callback,interval,once);
        if (!this._timers) this._timers = [];
        this._timers.push(t);
        return t;
    }

}