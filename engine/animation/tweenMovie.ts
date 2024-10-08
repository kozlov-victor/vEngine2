import {ITweenDescription, Tween} from "./tween";
import {Game} from "../core/game";
import {Optional} from "@engine/core/declarations";

interface ITweenInMovie<T> {
    startTime: number;
    tween: Tween<T>;
}


export class TweenMovie {
    private _loop = false;
    private _onComplete:Optional<(()=>void)>;
    private _tweensInMovie:ITweenInMovie<unknown>[] = [];
    private _startedTime = 0;
    private _completed = false;

    constructor(private game:Game){}

    public addTween<T>(startTime:number, desc:ITweenDescription<T>):TweenMovie{
        const tween:Tween<unknown> = new Tween<T>(this.game,desc) as Tween<unknown>;
        this._tweensInMovie.push({
            startTime,
            tween
        });
        return this;
    }

    public loop(val:boolean):TweenMovie {
        this._loop = val;
        return this;
    }

    public finish(fn:()=>void):TweenMovie{
        this._onComplete = fn;
        return this;
    }

    public play():void{
        this.game.getCurrentScene().addTweenMovie(this);
    }

    public update():void{
        if (this._completed) return;
        const currTime = this.game.getCurrentTime();
        if (this._startedTime===0) this._startedTime = currTime;
        const deltaTime = currTime - this._startedTime;
        let allCompleted = true;

        for (const item of this._tweensInMovie) {
            if (deltaTime>item.startTime) {
                if (deltaTime<item.startTime+item.tween.getTweenTime()) {
                    item.tween.update();
                } else {
                    item.tween.complete();
                }
            }
            if (!item.tween.isCompleted()) allCompleted = false;
        }

        if (allCompleted) {
            if (this._loop) {
                this.reset();
            } else {
                this._completed = true;
                if (this._onComplete) this._onComplete();
            }
        }
    }

    public isCompleted():boolean{
        return this._completed;
    }

    public reset():TweenMovie {
        this._startedTime = 0;
        this._completed = false;
        this._tweensInMovie.forEach((item)=>{
            item.tween.reset();
        });
        return this;
    }
}
