import {Timer} from "@engine/core/timer";

export class TimerMacros {

    _timers: Timer[];

    /// #MACROS_BODY_BEGIN
    setTimer(callback:Function,interval:number){
        let t:Timer = new Timer(callback,interval);
        this._timers.push(t);
        return t;
    }
    /// #MACROS_BODY_END

}