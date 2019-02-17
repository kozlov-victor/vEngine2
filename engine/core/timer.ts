
export class Timer {

    private lastTime:number = 0;
    private readonly callback:Function;
    private readonly interval:number;

    constructor(callback:Function,interval:number){
        this.interval = interval;
        this.callback = callback;
    }

    onUpdate(time:number){
        if (!this.lastTime) this.lastTime = time;
        let delta:number = time - this.lastTime;
        if (delta !==0 && delta>this.interval) {
            this.lastTime = time;
            this.callback();
        }
    }

}