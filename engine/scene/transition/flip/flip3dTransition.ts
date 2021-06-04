import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";

abstract class AbstractFlip3dTransition extends AbstractSceneTransition {

    protected _imageOnTop:Image;
    protected _imageOnBottom:Image;

    protected readonly _wheelContainer:SimpleGameObjectContainer;

    constructor(
        game:Game,
        protected billboard:boolean,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear,
    )
    {
        super(game,time,easeFn);
        this._wheelContainer = new SimpleGameObjectContainer(this.game);
        this._wheelContainer.pos.setXY(this.game.size.width/2,this.game.height/2);

        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        this._wheelContainer.appendChild(imageOnBottom);
        this._wheelContainer.appendChild(imageOnTop);
        this._transitionScene.appendChild(this._wheelContainer);
        this._imageOnBottom = imageOnBottom;
        this._imageOnTop = imageOnTop;
        imageOnTop.depthTest = imageOnBottom.depthTest = true;
        imageOnTop.billBoard = imageOnBottom.billBoard = billboard;
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract override getFromTo():{from:number,to:number};

}

abstract class AbstractFlipHorizontal3dTransition extends AbstractFlip3dTransition{

    constructor(
        game:Game,
        billboard:boolean,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear,
    )
    {
        super(game,billboard,time,easeFn);

        const z:number = this.game.width / 2;
        this._wheelContainer.pos.z = -z;

        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        imageOnBottom.anchorPoint.setXY(this.game.width/2,this.game.height/2);
        imageOnTop.anchorPoint.setXY(this.game.width/2,this.game.height/2);
        imageOnTop.pos.setX(this.game.size.width);
        imageOnTop.angle3d.y = Math.PI/2;
        imageOnTop.pos.z = imageOnBottom.pos.z = z;

    }

    protected onTransitionProgress(val: number): void {
        this._wheelContainer.angle3d.y = val;
    }

}

abstract class AbstractFlipVertical3dTransition extends AbstractFlip3dTransition{

    constructor(
        game:Game,
        billboard:boolean = false,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear,
    )
    {
        super(game,billboard,time,easeFn);

        const z:number = this.game.height / 2;
        this._wheelContainer.pos.z = -z;

        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        imageOnBottom.anchorPoint.setXY(this.game.width/2,this.game.height/2);
        imageOnTop.anchorPoint.setXY(this.game.width/2,this.game.height/2);
        imageOnTop.pos.setY(this.game.size.height);
        imageOnTop.angle3d.x = -Math.PI/2;
        imageOnTop.pos.z = imageOnBottom.pos.z = z;
    }

    protected onTransitionProgress(val: number): void {
        this._wheelContainer.angle3d.x = val;
    }

}

export class Flip3dHorizontalInTransition extends AbstractFlipHorizontal3dTransition {
    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0, to: -Math.PI/2};
    }

    getOppositeTransition(): ISceneTransition {
        return new Flip3dHorizontalOutTransition(this.game,this.billboard,this.time,this.easeFn);
    }
}

export class Flip3dHorizontalOutTransition extends AbstractFlipHorizontal3dTransition {
    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: -Math.PI/2, to: 0};
    }

    getOppositeTransition(): ISceneTransition {
        return new Flip3dHorizontalInTransition(this.game,this.billboard,this.time,this.easeFn);
    }
}

export class Flip3dVerticalInTransition extends AbstractFlipVertical3dTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0, to: Math.PI/2};
    }

    getOppositeTransition(): ISceneTransition {
        return new Flip3dVerticalOutTransition(this.game,this.billboard,this.time,this.easeFn);
    }

}

export class Flip3dVerticalOutTransition extends AbstractFlipVertical3dTransition {
    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: Math.PI/2, to: 0};
    }

    getOppositeTransition(): ISceneTransition {
        return new Flip3dVerticalInTransition(this.game,this.billboard,this.time,this.easeFn);
    }
}
