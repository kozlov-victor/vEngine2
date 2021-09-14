import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {Game} from "@engine/core/game";


export class TweenableDelegate {

    private _tweens:Tween<unknown>[];
    private _tweenMovies:TweenMovie[];

    public constructor(private game:Game) {
    }

    public tween<T>(desc:ITweenDescription<T>):Tween<T>{
        const t = new Tween(this.game,desc);
        this.addTween(t);
        return t;
    }

    public addTween<T>(t:Tween<T>):void{
        if (!this._tweens) this._tweens = [];
        this._tweens.push(t as Tween<unknown>);
    }

    public addTweenMovie(tm:TweenMovie):void {
        if (!this._tweenMovies) this._tweenMovies = [];
        this._tweenMovies.push(tm);
    }


    public update():void {
        if (this._tweens!==undefined) {
            for (let i:number = 0,l=this._tweens.length;i<l;i++) {
                const t = this._tweens[i];
                t.update();
                if (t.isCompleted()) {
                    this._tweens.splice(i,1);
                    l--;
                }
            }
        }
        if (this._tweenMovies!==undefined) {
            for (let i:number = 0,l=this._tweenMovies.length;i<l;i++) {
                const t = this._tweenMovies[i];
                t.update();
                if (t.isCompleted()) {
                    this._tweenMovies.splice(i,1);
                    l--;
                }
            }
        }
    }

}
