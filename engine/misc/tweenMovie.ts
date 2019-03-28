import {Tween, TweenDescription} from "./tween";
import {Game} from "../game";

interface TweenInMovie {
    startTime: number,
    tween: Tween
}


export class TweenMovie {
    private _tweensInMovie:TweenInMovie[] = [];
    private _startedTime:number = null;
    private _completed:boolean = false;
    _loop:boolean = false;
    _onComplete:()=>void = null;

    constructor(private game:Game){}

    tween(startTime:number,desc:TweenDescription):TweenMovie{
        let tween:Tween = new Tween(desc);
        this._tweensInMovie.push({
            startTime: startTime,
            tween: tween
        });
        return this;
    }

    loop(val:boolean):TweenMovie {
        this._loop = val;
        return this;
    }

    finish(fn:()=>void):TweenMovie{
        this._onComplete = fn;
        return this;
    }

    play():void{
        // if (isGlobal) {
        //     game.addTweenMovie(this);
        this.game.getCurrScene().addTweenMovie(this);
    }

    update(){
        if (this._completed) return;
        const currTime:number = this.game.getTime();
        if (!this._startedTime) this._startedTime = currTime;
        let deltaTime:number = currTime - this._startedTime;
        let allCompleted:boolean = true;
        this._tweensInMovie.forEach((item:TweenInMovie)=>{
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
                this._onComplete && this._onComplete();
            }
        }
    };

    isCompleted():boolean{
        return this._completed;
    }

    reset() {
        this._startedTime = null;
        this._completed = false;
        this._tweensInMovie.forEach((item:TweenInMovie)=>{
            item.tween.reset();
        });
        return this;
    }
}