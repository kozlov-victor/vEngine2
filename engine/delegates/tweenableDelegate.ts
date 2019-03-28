import {Tween, TweenDescription} from "@engine/misc/tween";
import {TweenMovie} from "@engine/misc/tweenMovie";


export class TweenableDelegate {

    private _tweens:Tween[];
    private _tweenMovies:TweenMovie[];

    tween(desc:TweenDescription):Tween{
        let t:Tween = new Tween(desc);
        if (!this._tweens) this._tweens = [];
        this._tweens.push(t);
        return t;
    }

    addTween(t:Tween):void{
        if (!this._tweens) this._tweens = [];
        this._tweens.push(t);
    }

    addTweenMovie(tm:TweenMovie){
        if (!this._tweenMovies) this._tweenMovies = [];
        this._tweenMovies.push(tm);
    }


    update(){
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