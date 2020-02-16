import {IAnimation} from "@engine/animation/iAnimation";
import {Game} from "@engine/core/game";

export abstract class AbstractPropertyAnimation implements IAnimation {

    protected progress:(opts:unknown)=>void;

    private playing:boolean = true;
    private startTime:number = 0;

    constructor(protected game: Game) {
    }

    public play(): void {
        this.playing = true;
    }

    public stop(): void {
        this.playing = false;
    }

    public reset(){
        this.startTime = 0;
    }

    public onProgress(progressFn:(opts:unknown)=>void){
        this.progress = progressFn;
    }

    public update(): void {
        if (!this.playing) return;
        const time:number = this.game.getCurrentTime();
        if (this.startTime===0) this.startTime = time;
        const passed:number = time - this.startTime;
        this.onUpdate(passed);
    }

    protected abstract onUpdate(timePassed:number):void;

}

