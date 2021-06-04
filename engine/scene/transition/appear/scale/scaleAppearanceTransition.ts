import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";

export abstract class AbstractScaleAppearanceTransition extends AbstractSceneTransition {

    protected _transformationTarget:Image;

    constructor(
        game:Game,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear,
        protected readonly axes: {x:boolean,y:boolean} = {x:true,y:true}
    )
    {
        super(game,time,easeFn);
        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        this._transitionScene.appendChild(imageOnBottom);
        this._transitionScene.appendChild(imageOnTop);
        this._transformationTarget = imageOnTop;
        this._transformationTarget.transformPoint.setToCenter();
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract override getFromTo():{from:number,to:number};

    protected onTransitionProgress(val: number): void {
        const scaleByX:number = this.axes.x?val:1;
        const scaleByY:number = this.axes.y?val:1;
        this._transformationTarget.scale.setXY(scaleByX,scaleByY);
    }

}

export class ScaleInAppearanceTransition extends AbstractScaleAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new ScaleOutAppearanceTransition(this.game,this.time,this.easeFn,this.axes);
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
        return new ScaleInAppearanceTransition(this.game,this.time,this.easeFn,this.axes);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 1,to: 0};
    }
}
