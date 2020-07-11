import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
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
        protected readonly time:number = 1000,
        protected readonly easeFn:EaseFn = EasingLinear)
    {
        super(game,time,easeFn);
        this._transitionScene.appendChild(this._currSceneImage);
        this._transitionScene.appendChild(this._prevSceneImage);
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

    protected getFromTo(): {from:number,to:number} {

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

        return {from,to}
    }


}
