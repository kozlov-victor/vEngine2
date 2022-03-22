import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {Image} from "@engine/renderable/impl/general/image/image";
import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";

abstract class AbstractFlipTransition extends AbstractSceneTransition{

    protected _imageOnTop:Image;
    protected _imageOnBottom:Image;


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
        imageOnBottom.transformPoint.setToCenter();
        imageOnTop.transformPoint.setToCenter();
        this._imageOnBottom = imageOnBottom;
        this._imageOnTop = imageOnTop;
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract override getFromTo():{from:number,to:number};

    protected onTransitionProgress(val: number): void {
        this._imageOnTop.angle3d.y = val;
        this._imageOnTop.visible = val<Math.PI/2;
        this._imageOnBottom.angle3d.y = val;
    }

}

abstract class AbstractVerticalFlipTransition extends AbstractFlipTransition {

    constructor(
        game:Game,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear,
    ) {
        super(game,time,easeFn);
        this._imageOnBottom.scale.x = -1;
    }

    protected override onTransitionProgress(val: number): void {
        this._imageOnTop.angle3d.y = val;
        this._imageOnTop.visible = val<Math.PI/2;
        this._imageOnBottom.angle3d.y = val;
    }

}

abstract class AbstractHorizontalFlipTransition extends AbstractFlipTransition {

    constructor(
        game:Game,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear,
    ) {
        super(game,time,easeFn);
        this._imageOnBottom.scale.y = -1;
    }

    protected override onTransitionProgress(val: number): void {
        this._imageOnTop.angle3d.x = val;
        this._imageOnTop.visible = val<Math.PI/2;
        this._imageOnBottom.angle3d.x = val;
    }

}

export class FlipVerticalInTransition extends AbstractVerticalFlipTransition {
    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0, to: Math.PI};
    }

    getOppositeTransition(): ISceneTransition {
        return new FlipVerticalOutTransition(this.game,this.time,this.easeFn);
    }
}

export class FlipVerticalOutTransition extends AbstractVerticalFlipTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: Math.PI,to: 0};
    }

    getOppositeTransition(): ISceneTransition {
        return new FlipVerticalInTransition(this.game,this.time,this.easeFn);
    }
}

export class FlipHorizontalInTransition extends AbstractHorizontalFlipTransition {
    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0, to: Math.PI};
    }

    getOppositeTransition(): ISceneTransition {
        return new FlipHorizontalOutTransition(this.game,this.time,this.easeFn);
    }
}

export class FlipHorizontalOutTransition extends AbstractHorizontalFlipTransition {
    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: Math.PI,to: 0};
    }

    getOppositeTransition(): ISceneTransition {
        return new FlipHorizontalInTransition(this.game,this.time,this.easeFn);
    }
}

