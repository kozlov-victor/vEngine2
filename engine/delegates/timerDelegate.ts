import {Timer} from "@engine/misc/timer";
import {Game} from "@engine/core/game";

export class TimerDelegate {

    constructor(private game:Game) {
    }

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

    public update():void{
        if (!this._timers) return;
        for (const t of this._timers) {
            t.onUpdate();
        }
    }


    private _addTimer(callback:()=>void,interval:number,once:boolean):Timer{
        const t:Timer = new Timer(this.game,this,callback,interval,once);
        if (!this._timers) this._timers = [];
        this._timers.push(t);
        return t;
    }

}
