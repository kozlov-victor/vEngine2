import {Timer} from "@engine/misc/timer";

export class TimerDelegate {

    private _timers: Timer[];


    private _addTimer(callback:Function,interval:number,once:boolean):Timer{
        const t:Timer = new Timer(this,callback,interval,once);
        if (!this._timers) this._timers = [];
        this._timers.push(t);
        return t;
    }

    setInterval(callback:Function,interval:number):Timer{
        return this._addTimer(callback,interval,false);
    }

    setTimeout(callback:Function,interval:number):Timer{
        return this._addTimer(callback,interval,true);
    }

    getTimers():Timer[]{
        return this._timers;
    }

    update(){
        if (!this._timers) return;
        for (const t of this._timers) {
            t.onUpdate();
        }
    }

}