import {Game} from "@engine/core/game";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {removeFromArray} from "@engine/misc/object";

export class Timer {

    private lastTime:number = 0;
    private readonly callback:()=>void;
    private readonly interval:number;

    constructor(private parent:TimerDelegate,callback:()=>void,interval:number,private once:boolean){
        this.interval = interval;
        this.callback = callback;
    }

    public onUpdate():void {
        const time:number = Game.getInstance().getCurrentTime();
        if (!this.lastTime) this.lastTime = time;
        const delta:number = time - this.lastTime;
        if (delta !==0 && delta>this.interval) {
            this.lastTime = time;
            this.callback();
            if (this.once) this.kill();
        }
    }

    public kill():void{
        removeFromArray(this.parent.getTimers(),(it)=>it===this);
    }

}
