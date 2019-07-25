import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";


export class TweenableDelegate {

    private _tweens:Tween[];
    private _tweenMovies:TweenMovie[];

    public tween(desc:ITweenDescription):Tween{
        const t:Tween = new Tween(desc);
        if (!this._tweens) this._tweens = [];
        this._tweens.push(t);
        return t;
    }

    public addTween(t:Tween):void{
        if (!this._tweens) this._tweens = [];
        this._tweens.push(t);
    }

    public addTweenMovie(tm:TweenMovie):void {
        if (!this._tweenMovies) this._tweenMovies = [];
        this._tweenMovies.push(tm);
    }


    public update():void {
        if (this._tweens) this._tweens.forEach((t:Tween, index:number)=>{
            t.update();
            if (t.isCompleted()) this._tweens.splice(index,1);
        });
        if (this._tweenMovies) this._tweenMovies.forEach((t:TweenMovie,index:number)=>{
            t.update();
            if (t.isCompleted()) this._tweenMovies.splice(index,1);
        });
    }

}