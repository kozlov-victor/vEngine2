import {ITweenDescription, Tween} from "./tween";
import {Game} from "../game";

interface ITweenInMovie {
    startTime: number;
    tween: Tween;
}


export class TweenMovie {
    private _loop:boolean = false;
    private _onComplete:(arg?:any)=>void = null;
    private _tweensInMovie:ITweenInMovie[] = [];
    private _startedTime:number = null;
    private _completed:boolean = false;

    constructor(private game:Game){}

    public addTween(startTime:number, desc:ITweenDescription):TweenMovie{
        const tween:Tween = new Tween(desc);
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
        this.game.getCurrScene().addTweenMovie(this);
    }

    public update():void{
        if (this._completed) return;
        const currTime:number = this.game.getTime();
        if (!this._startedTime) this._startedTime = currTime;
        const deltaTime:number = currTime - this._startedTime;
        let allCompleted:boolean = true;
        this._tweensInMovie.forEach((item:ITweenInMovie)=>{
            if (deltaTime>item.startTime) {
                if (deltaTime<item.startTime+item.tween.getTweenTime()) {
                    item.tween.update();
                } else {
                    item.tween.complete();
                }
            }
            if (!item.tween.isCompleted()) allCompleted = false;
        });

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
        this._startedTime = null;
        this._completed = false;
        this._tweensInMovie.forEach((item:ITweenInMovie)=>{
            item.tween.reset();
        });
        return this;
    }
}