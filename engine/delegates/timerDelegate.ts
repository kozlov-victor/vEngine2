import {Timer} from "@engine/misc/timer";

const identity_array:Timer[] = [];

export class TimerDelegate {

    private _timers: Timer[];

    setTimer(callback:Function,interval:number):Timer{
        const t:Timer = new Timer(callback,interval);
        if (!this._timers) this._timers = [];
        this._timers.push(t);
        return t;
    }

    get timers():Timer[]{
        if (this._timers) return this._timers;
        return identity_array;
    }

    update(){
        if (this._timers) this._timers.forEach((t:Timer)=>{
            t.onUpdate();
        });
    }

}