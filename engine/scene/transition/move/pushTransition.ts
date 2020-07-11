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

export class PushTransition extends AbstractSceneTransition {

    constructor(
        protected readonly game:Game,
        private readonly sideTo:SIDE = SIDE.BOTTOM,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super(game);
        this._transitionScene.appendChild(this._prevSceneImage);
        this._transitionScene.appendChild(this._currSceneImage);
    }

    public render(): void {
        super.render();
        this._transitionScene.render();
    }

    public complete(): void {
        super.complete();
        this._currSceneImage.pos.setXY(0);
    }

    public getOppositeTransition(): ISceneTransition {
        return new PushTransition(this.game,OPPOSITE_SIDE.resolve(this.sideTo),this.time,this.easeFn);
    }

    protected onTransitionProgress(val:number): void {
        switch (this.sideTo) {
            case SIDE.RIGHT:
            case SIDE.LEFT:
                this._currSceneImage.pos.setX(val);
                break;
            case SIDE.TOP:
            case SIDE.BOTTOM:
                this._currSceneImage.pos.setY(val);
                break;
        }
    }

    protected describe(): SceneProgressDescription {

        let from:number = 0, to:number = 0;
        switch (this.sideTo) {
            case SIDE.BOTTOM:
                from = -this.game.size.height;
                to = 0;
                break;
            case SIDE.TOP:
                from = this.game.size.height;
                to = 0;
                break;
            case SIDE.LEFT:
                from = this.game.size.width;
                to = 0;
                break;
            case SIDE.RIGHT:
                from = -this.game.size.width;
                to = 0;
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
