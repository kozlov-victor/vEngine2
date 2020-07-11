import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {OPPOSITE_SIDE, SIDE} from "@engine/scene/transition/move/side";
import {DebugError} from "@engine/debug/debugError";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";

export class PopTransition extends AbstractSceneTransition {

    constructor(
        protected readonly game:Game,
        private readonly sideTo:SIDE = SIDE.BOTTOM,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super(game);
        this._transitionScene.appendChild(this._currSceneImage);
        this._transitionScene.appendChild(this._prevSceneImage);
    }

    public render(): void {
        super.render();
        this._transitionScene.render();
    }

    public complete(): void {
        super.complete();
        this._prevSceneImage.pos.setXY(0);
    }

    public getOppositeTransition(): ISceneTransition {
        return new PopTransition(this.game,OPPOSITE_SIDE.resolve(this.sideTo),this.time,this.easeFn);
    }

    protected onTransitionProgress(val:number): void {
        switch (this.sideTo) {
            case SIDE.RIGHT:
            case SIDE.LEFT:
                if (this._prevScene!==undefined) this._prevSceneImage.pos.setX(val);
                break;
            case SIDE.TOP:
            case SIDE.BOTTOM:
                if (this._prevScene!==undefined) this._prevSceneImage.pos.setY(val);
                break;
        }
    }

    protected describe(): SceneProgressDescription {

        let from:number = 0, to:number = 0;
        switch (this.sideTo) {
            case SIDE.BOTTOM:
                from = 0;
                to = this.game.size.height;
                break;
            case SIDE.TOP:
                from = 0;
                to = -this.game.size.height;
                break;
            case SIDE.LEFT:
                from = 0;
                to = -this.game.size.width;
                break;
            case SIDE.RIGHT:
                from = 0;
                to = this.game.size.width;
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown side: ${this.sideTo}`);
                break;
        }

        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }


}
