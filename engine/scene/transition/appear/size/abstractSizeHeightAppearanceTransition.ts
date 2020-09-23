import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";

export abstract class AbstractSizeHeightAppearanceTransition extends AbstractSceneTransition {

    protected _transformationTarget:Image;

    constructor(
        protected readonly game:Game,
        protected readonly time:number = 1000,
        protected readonly easeFn:EaseFn = EasingLinear,
    )
    {
        super(game,time,easeFn);
        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        this._transitionScene.appendChild(imageOnBottom);
        this._transitionScene.appendChild(imageOnTop);
        this._transformationTarget = imageOnTop;
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract getFromTo():{from:number,to:number};

    protected onTransitionProgress(val: number): void {
        this._transformationTarget.pos.setY(this.game.height/2 - val);
        this._transformationTarget.getSrcRect().setXYWH(
             0,this.game.size.height/2 - val,
            this.game.width,val*2
        );
        this._transformationTarget.size.height = val*2;
        this._transformationTarget.visible = this._transformationTarget.size.height!==0;
    }

}

export class SizeHeightInAppearanceTransition extends AbstractSizeHeightAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new SizeHeightOutAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: this.game.size.height/2};
    }

}

export class SizeHeightOutAppearanceTransition extends AbstractSizeHeightAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new SizeHeightInAppearanceTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): {from: number; to: number} {
        return {from: this.game.size.height/2,to: 0};
    }
}
