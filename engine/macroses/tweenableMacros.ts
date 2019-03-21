import {Tween, TweenDescription} from "@engine/core/tween";
import {TweenMovie} from "@engine/core/tweenMovie";

class TweenableMacros {

    _tweens:Tween[];
    _tweenMovies:TweenMovie[];

    /// #MACROS_BODY_BEGIN
    tween(desc:TweenDescription):Tween{
        let t:Tween = new Tween(desc);
        this._tweens.push(t);
        return t;
    }

    addTween(t:Tween):void{
        this._tweens.push(t);
    }

    addTweenMovie(tm:TweenMovie){
        this._tweenMovies.push(tm);
    }
    /// #MACROS_BODY_END
}