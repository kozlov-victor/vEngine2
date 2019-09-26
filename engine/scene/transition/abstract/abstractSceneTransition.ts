import {EaseFn, ITweenDescription, Tween} from "@engine/animation/tween";
import {Scene} from "@engine/scene/scene";
import {Optional} from "@engine/core/declarations";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";


export abstract class AbstractSceneTransition implements ISceneTransition{

    protected _prevScene: Optional<Scene>;
    protected _currScene: Scene;
    protected _onComplete: () => void;

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
    }

    public abstract render(): void;

    protected abstract onTweenCreated():ITweenDescription;

    protected abstract onTransitionProgress(val: number, prevScene: Optional<Scene>, currScene: Scene): void;

    protected abstract onTransitionCompleted(prevScene: Optional<Scene>, currScene: Scene): void;

}