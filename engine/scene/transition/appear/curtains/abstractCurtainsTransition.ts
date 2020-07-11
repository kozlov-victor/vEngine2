import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export abstract class AbstractCurtainsTransition extends AbstractSceneTransition {

    private readonly _leftCurtain:Image;
    private readonly _rightCurtain:Image;

    constructor(
        protected readonly game:Game,
        protected readonly time:number = 1000,
        protected readonly easeFn:EaseFn = EasingLinear)
    {
        super(game);

        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();

        this._transitionScene.appendChild(imageOnBottom);
        // noinspection JSSuspiciousNameCombination
        this._leftCurtain = imageOnTop;
        this._rightCurtain = imageOnTop.clone();
        this._transitionScene.appendChild(this._leftCurtain);
        this._transitionScene.appendChild(this._rightCurtain);

        this._leftCurtain.getSrcRect().setXYWH(0,0,this.game.size.width/2,this.game.size.height);
        this._leftCurtain.size.width = this.game.size.width/2;

        this._rightCurtain.getSrcRect().setXYWH(this.game.size.width/2,0,this.game.size.width/2,this.game.size.height);
        this._rightCurtain.size.width = this.game.size.width/2;

    }

    public render(): void {
        super.render();
        this._transitionScene.render();
    }

    public complete(): void {
        super.complete();
        this._currSceneImage.pos.setXY(0);
        this._prevSceneImage.pos.setXY(0);
    }

    protected onTransitionProgress(val:number): void {
        this._leftCurtain.pos.setX(val);
        this._rightCurtain.pos.setX(-val+this.game.size.width/2);
    }

    protected abstract getBottomAndTopImages():[Image,Image];

}
