import {IAnimation, ITargetAnimation} from "@engine/animation/iAnimation";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Optional} from "@engine/core/declarations";

export abstract class AbstractPropertyAnimation implements ITargetAnimation {

    public readonly target:Optional<RenderableModel>;

    protected progress:Optional<(...opts:unknown[])=>void>;

    protected passedTime:number = 0;

    private _playing:boolean = true;
    private _startTime:number = 0;


    constructor(protected game: Game) {
    }

    public play(): void {
        this._playing = true;
    }

    public stop(): void {
        this._playing = false;
    }

    public reset():void{
        this._startTime = 0;
    }

    public onProgress(progressFn:(opts:unknown)=>void):void{
        this.progress = progressFn;
    }

    public update(): void {
        if (!this._playing) return;
        const time:number = this.game.getCurrentTime();
        if (this._startTime===0) this._startTime = time;
        this.passedTime = time - this._startTime;
        this.onUpdate();
    }

    protected abstract onUpdate():void;

}

