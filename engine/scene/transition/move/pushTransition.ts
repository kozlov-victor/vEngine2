import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {OPPOSITE_SIDE, SIDE} from "@engine/scene/transition/move/side";
import {DebugError} from "@engine/debug/debugError";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";

export class PushTransition extends AbstractSceneTransition {

    constructor(
        game:Game,
        public sideTo:SIDE = SIDE.BOTTOM,
        time:number = 1000,
        easeFn:EaseFn = EasingLinear)
    {
        super(game,time,easeFn);
        this._transitionScene.appendChild(this._prevSceneImage);
        this._transitionScene.appendChild(this._currSceneImage);
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

    protected getFromTo(): {from:number,to:number} {

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

        return {from,to};
    }


}
