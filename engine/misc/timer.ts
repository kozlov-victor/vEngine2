import {Game} from "@engine/core/game";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {removeFromArray} from "@engine/misc/object";

export class Timer {

    private _lastTime:number = 0;
    private readonly _callback:()=>void;
    private readonly _interval:number;

    constructor(private parent:TimerDelegate,callback:()=>void,interval:number,private once:boolean){
        this._interval = interval;
        this._callback = callback;
    }

    public onUpdate():void {
        const time:number = Game.getInstance().getCurrentTime();
        if (!this._lastTime) this._lastTime = time;
        const delta:number = time - this._lastTime;
        if (delta !==0 && delta>this._interval) {
            this._lastTime = time;
            this._callback();
            if (this.once) this.kill();
        }
    }

    public kill():void{
        removeFromArray(this.parent.getTimers(),(it)=>it===this);
    }

}
