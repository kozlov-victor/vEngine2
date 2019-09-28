import {EaseFn, ITweenDescription, Tween} from "@engine/animation/tween";
import {Scene} from "@engine/scene/scene";
import {Optional} from "@engine/core/declarations";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";


export abstract class AbstractSceneTransition implements ISceneTransition{

    protected _prevScene: Optional<Scene>;
    protected _currScene: Scene;
    protected _onComplete: () => void;
    private _tween:Tween;

    protected constructor() {

    }

    public onComplete(fn: () => void): void {
        this._onComplete = fn;
    }

    public start(prevScene: Scene, currScene: Scene): void {
        const t:Tween = new Tween(this.onTweenCreated());
        this._currScene = currScene;
        this._prevScene = prevScene;
        currScene.addTween(t);
        this._tween = t;
    }

    public abstract render(): void;

    public reset():void {
        this._tween.complete();
    }

    protected abstract onTweenCreated():ITweenDescription;

    protected abstract onTransitionProgress(val: number): void;


}