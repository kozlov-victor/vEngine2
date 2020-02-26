import {IAnimation} from "@engine/animation/iAnimation";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Optional} from "@engine/core/declarations";

export abstract class AbstractPropertyAnimation implements IAnimation {

    public readonly target:Optional<RenderableModel>;

    protected progress:Optional<(...opts:unknown[])=>void>;

    protected passedTime:number = 0;

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
        this.passedTime = time - this.startTime;
        this.onUpdate();
    }

    protected abstract onUpdate():void;

}

