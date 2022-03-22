import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image/image";

export abstract class AbstractTurnThePageAppearanceTransition extends AbstractSceneTransition {

    protected _transformationTarget:Image;
    protected _rightPageForward:Image;
    protected _rightPageBackward:Image;

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

        this._transformationTarget.size.width = this.game.width/2;
        this._transformationTarget.getSrcRect().setXYWH(0,0,this.game.width/2,this.game.height);

        //image on top is under right page
        imageOnTop.size.setWH(this.game.width/2,this.game.height);
        imageOnTop.pos.setXY(this.game.width/2,0);
        imageOnTop.getSrcRect().setXYWH(this.game.width/2,0,this.game.width/2,this.game.height);

        this._rightPageForward = imageOnBottom.clone();
        this._rightPageForward.size.setWH(this.game.width/2,this.game.height);
        this._rightPageForward.pos.setXY(this.game.width/2,0);
        this._rightPageForward.getSrcRect().setXYWH(this.game.width/2,0,this.game.width/2,this.game.height);
        this._transitionScene.appendChild(this._rightPageForward);

        this._rightPageBackward = imageOnTop.clone();
        this._rightPageBackward.size.setWH(this.game.width/2,this.game.height);
        this._rightPageBackward.getSrcRect().setXYWH(0,0,this.game.width/2,this.game.height);
        this._rightPageBackward.pos.setXY(0,0);
        this._rightPageBackward.scale.x = -1;
        this._rightPageBackward.transformPoint.setXY(this.game.width/2,0);
        this._transitionScene.appendChild(this._rightPageBackward);

    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract override getFromTo():{from:number,to:number};

    protected onTransitionProgress(val: number): void {
        this._rightPageForward.angle3d.y = val;
        this._rightPageForward.visible = val>=-Math.PI/2;

        this._rightPageBackward.angle3d.y = val;
        this._rightPageBackward.visible = val<-Math.PI/2;
    }

}

export class TurnThePageForwardTransition extends AbstractTurnThePageAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new TurnThePageBackwardTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: -Math.PI};
    }

}

export class TurnThePageBackwardTransition extends AbstractTurnThePageAppearanceTransition {

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

    public getOppositeTransition(): ISceneTransition {
        return new TurnThePageForwardTransition(this.game,this.time,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: -Math.PI,to: 0};
    }
}
