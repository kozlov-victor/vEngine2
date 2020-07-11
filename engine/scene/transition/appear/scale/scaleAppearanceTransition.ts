import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";

export abstract class AbstractScaleAppearanceTransition extends AbstractSceneTransition {

    protected _transformationTarget:Image;

    constructor(
        protected readonly game:Game,
        protected readonly time:number = 1000,
        protected readonly easeFn:EaseFn = EasingLinear,
    )
    {
        super(game);
        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        this._transitionScene.appendChild(imageOnBottom);
        this._transitionScene.appendChild(imageOnTop);
        this._transformationTarget = imageOnTop;
        this._transformationTarget.transformPoint.setToCenter();
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract getFromTo():{from:number,to:number};

    protected describe(): SceneProgressDescription {
        const from:number = this.getFromTo().from;
        const to:number = this.getFromTo().to;
        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }

    protected onTransitionProgress(val: number): void {
        this._transformationTarget.scale.setXY(val);
    }

}

export class ScaleInAppearanceTransition extends AbstractScaleAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new ScaleOutAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: 1};
    }

}

export class ScaleOutAppearanceTransition extends AbstractScaleAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new ScaleInAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 1,to: 0};
    }
}
