import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";

export abstract class AbstractSizeWidthAppearanceTransition extends AbstractSceneTransition {

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
        this._transformationTarget.pos.setX(this.game.width/2 - val);
        this._transformationTarget.getSrcRect().setXYWH(
            this.game.size.width/2 - val, 0,
            val*2, this.game.height
        );
        this._transformationTarget.size.width = val*2;
        this._transformationTarget.visible = this._transformationTarget.size.width!==0;
    }

}

export class SizeWidthInAppearanceTransition extends AbstractSizeWidthAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new SizeWidthOutAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: this.game.size.width/2};
    }

}

export class SizeWidthOutAppearanceTransition extends AbstractSizeWidthAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new SizeWidthInAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): {from: number; to: number} {
        return {from: this.game.size.width/2,to: 0};
    }
}
