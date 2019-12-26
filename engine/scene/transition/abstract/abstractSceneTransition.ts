import {ITweenDescription, Tween} from "@engine/animation/tween";
import {Scene} from "@engine/scene/scene";
import {Optional} from "@engine/core/declarations";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";

export interface ISceneTransitionValue {
    val: number;
}

export type SceneProgressDescription = Omit<ITweenDescription<ISceneTransitionValue>,'progress|complete'>;

export abstract class AbstractSceneTransition implements ISceneTransition{

    protected _prevScene: Optional<Scene>;
    protected _currScene!: Scene;
    protected _onComplete!: () => void;
    private _tween!:Tween<ISceneTransitionValue>;
    private _completed:boolean = false;

    protected constructor() {

    }

    public onComplete(fn: () => void): void {
        this._onComplete = fn;
    }

    public start(prevScene: Optional<Scene>, currScene: Scene): void {
        const desc:ITweenDescription<ISceneTransitionValue> = {
            ...this.describe(),
            progress: (obj: { val: number }) => {
                this.onTransitionProgress(obj.val);
            },
            complete: () => {
                this.complete();
                this._onComplete();
            }
        };
        const t:Tween<ISceneTransitionValue> = new Tween(desc);
        this._currScene = currScene;
        this._prevScene = prevScene;
        t.update();
        this._tween = t;
    }

    public abstract render(): void;

    public update():void {
        if (this._currScene!==undefined) this._currScene.update();
        if (this._prevScene!==undefined) this._prevScene.update();
        this._tween.update();
    }

    public complete():void {
        if (this._completed) return;
        this._completed = true;
        this._tween.complete();
    }

    public abstract getOppositeTransition():ISceneTransition;

    protected abstract describe():SceneProgressDescription;

    protected abstract onTransitionProgress(val:number): void;


}