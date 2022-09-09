import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export abstract class AbstractCurtainsTransition extends AbstractSceneTransition {

    private readonly _leftCurtain:Image;
    private readonly _rightCurtain:Image;

    constructor(
        game:Game,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear)
    {
        super(game,time,easeFn);

        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();

        this._transitionScene.appendChild(imageOnBottom);
        // noinspection JSSuspiciousNameCombination
        this._leftCurtain = imageOnTop;
        this._rightCurtain = imageOnTop.clone();
        this._transitionScene.appendChild(this._leftCurtain);
        this._transitionScene.appendChild(this._rightCurtain);

        this._leftCurtain.srcRect.setXYWH(0,0,this.game.size.width/2,this.game.size.height);
        this._leftCurtain.size.width = this.game.size.width/2;

        this._rightCurtain.srcRect.setXYWH(this.game.size.width/2,0,this.game.size.width/2,this.game.size.height);
        this._rightCurtain.size.width = this.game.size.width/2;

    }

    protected onTransitionProgress(val:number): void {
        this._leftCurtain.pos.setX(val);
        this._rightCurtain.pos.setX(-val+this.game.size.width/2);
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract override getFromTo():{from:number,to:number};

}
