import {ITweenDescription, Tween} from "@engine/animation/tween";
import {Scene} from "@engine/scene/scene";
import {Optional} from "@engine/core/declarations";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {EaseFn} from "@engine/misc/easing/type";
import {SceneLifeCycleState} from "@engine/scene/sceneLifeCicleState";

export interface ISceneTransitionValue {
    val: number;
}

class ImageWithRenderTarget extends Image {

    public renderTarget:IRenderTarget;

}

export abstract class AbstractSceneTransition implements ISceneTransition{

    protected _prevScene: Optional<Scene>;
    protected _currScene!: Scene;
    protected _onComplete!: () => void;

    protected readonly _prevSceneImage:ImageWithRenderTarget = this._createImageWithRenderTarget();
    protected readonly _currSceneImage:ImageWithRenderTarget = this._createImageWithRenderTarget();
    protected readonly _transitionScene:Scene = new class extends Scene {}(this.game);

    private _tween!:Tween<ISceneTransitionValue>;
    private _completed:boolean = false;

    protected constructor(protected game:Game,protected readonly time:number, protected readonly easeFn:EaseFn) {
        this._transitionScene.lifeCycleState = SceneLifeCycleState.COMPLETED;
    }

    public onComplete(fn: () => void): void {
        this._onComplete = fn;
    }

    public setBackgroundColor(color:IColor):void {
        this._transitionScene.backgroundColor.set(color);
    }

    public start(prevScene: Optional<Scene>, currScene: Scene): void {
        const {from,to} = this.getFromTo();
        const desc:ITweenDescription<ISceneTransitionValue> = {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn,
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

    public render(): void {
        if (this._prevScene!==undefined) this._prevScene.renderToTexture(this._prevSceneImage.renderTarget);
        this._currScene.renderToTexture(this._currSceneImage.renderTarget);
        this._transitionScene.render();
    }

    public update():void {
        this._currScene.update();
        if (this._prevScene!==undefined) this._prevScene.update();
        this._tween.update();
    }

    public complete():void {
        if (this._completed) return;
        this._completed = true;
        this._tween.complete();
        this._currScene._renderingSessionInfo.drawingStackEnabled = true;
        this._currScene._renderingSessionInfo.drawingEnabled = true;
    }

    public abstract getOppositeTransition():ISceneTransition;

    protected abstract getFromTo():{from:number,to:number};

    protected abstract onTransitionProgress(val:number): void;

    private _createImageWithRenderTarget():ImageWithRenderTarget{
        const renderTarget:IRenderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,this.game.size);
        const image:ImageWithRenderTarget = new ImageWithRenderTarget(this.game,renderTarget.getTexture());
        image.renderTarget = renderTarget;
        return image;
    }

}
