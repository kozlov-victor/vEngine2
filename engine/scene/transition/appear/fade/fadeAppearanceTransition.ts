import {AbstractSceneTransition,} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";


export abstract class AbstractFadeAppearanceTransition extends AbstractSceneTransition {

    protected _transformationTarget:Image;

    constructor(
        game:Game,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear,
    )
    {
        super(game,time,easeFn);
        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        this._transitionScene.appendChild(imageOnBottom);
        this._transitionScene.appendChild(imageOnTop);
        this._transformationTarget = imageOnTop;
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract override getFromTo():{from:number,to:number};

    protected onTransitionProgress(val: number): void {
        this._transformationTarget.alpha = val;
    }

}

export class FadeInAppearanceTransition extends AbstractFadeAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new FadeOutAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: 1};
    }

}

export class FadeOutAppearanceTransition extends AbstractFadeAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new FadeInAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 1,to: 0};
    }
}
