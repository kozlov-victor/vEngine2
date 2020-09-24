import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";

export abstract class AbstractTurnThePageVerticalAppearanceTransition extends AbstractSceneTransition {

    protected _transformationTarget:Image;
    protected _bottomPageForward:Image;
    protected _bottomPageBackward:Image;

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

        this._transformationTarget.size.height = this.game.height/2;
        this._transformationTarget.getSrcRect().setXYWH(0,0,this.game.width,this.game.height/2);

        //image on top is under right page
        imageOnTop.size.setWH(this.game.width,this.game.height/2);
        imageOnTop.pos.setXY(0,this.game.height/2);
        imageOnTop.getSrcRect().setXYWH(0,this.game.height/2,this.game.width,this.game.height/2);

        this._bottomPageForward = imageOnBottom.clone();
        this._bottomPageForward.size.setWH(this.game.width,this.game.height/2);
        this._bottomPageForward.pos.setXY(0,this.game.height/2);
        this._bottomPageForward.getSrcRect().setXYWH(0,this.game.height/2,this.game.width,this.game.height/2);
        this._transitionScene.appendChild(this._bottomPageForward);

        this._bottomPageBackward = imageOnTop.clone();
        this._bottomPageBackward.size.setWH(this.game.width,this.game.height/2);
        this._bottomPageBackward.getSrcRect().setXYWH(0,0,this.game.width,this.game.height/2);
        this._bottomPageBackward.pos.setXY(0,0);
        this._bottomPageBackward.scale.y = -1;
        this._bottomPageBackward.transformPoint.setXY(0,this.game.height/2);
        this._transitionScene.appendChild(this._bottomPageBackward);

    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract getFromTo():{from:number,to:number};

    protected onTransitionProgress(val: number): void {
        this._bottomPageForward.angle3d.x = val;
        this._bottomPageForward.visible = val<=Math.PI/2;

        this._bottomPageBackward.angle3d.x = val;
        this._bottomPageBackward.visible = val>Math.PI/2;
    }

}

export class TurnThePageVerticalForwardTransition extends AbstractTurnThePageVerticalAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new TurnThePageVerticalBackwardTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: Math.PI};
    }

}

export class TurnThePageVerticalBackwardTransition extends AbstractTurnThePageVerticalAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new TurnThePageVerticalForwardTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: Math.PI,to: 0};
    }
}
