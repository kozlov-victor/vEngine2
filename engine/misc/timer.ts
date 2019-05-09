import {Game} from "@engine/game";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {removeFromArray} from "@engine/misc/object";

export class Timer {

    private lastTime:number = 0;
    private readonly callback:Function;
    private readonly interval:number;

    constructor(private parent:TimerDelegate,callback:Function,interval:number,private once:boolean){
        this.interval = interval;
        this.callback = callback;
    }

    onUpdate():void {
        const time:number = Game.getInstance().getTime();
        if (!this.lastTime) this.lastTime = time;
        const delta:number = time - this.lastTime;
        if (delta !==0 && delta>this.interval) {
            this.lastTime = time;
            this.callback();
            if (this.once) this.kill();
        }
    }

    kill():void{
        removeFromArray(this.parent.getTimers(),(it:Timer)=>it===this);
    }

}