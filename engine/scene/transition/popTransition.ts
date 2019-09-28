import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {SIDE} from "@engine/scene/transition/side";
import {DebugError} from "@engine/debug/debugError";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export class PopTransition extends AbstractSceneTransition {

    constructor(
        private readonly game:Game,
        private readonly sideTo:SIDE = SIDE.BOTTOM,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }

    public render(): void {
        this._currScene.render();
        if (this._prevScene!==undefined) this._prevScene.render();
    }

    public complete(): void {
        super.complete();
        if (this._prevScene!==undefined) this._prevScene.pos.setXY(0);
        this._currScene.pos.setXY(0);
    }

    protected onTransitionProgress(val:number): void {
        switch (this.sideTo) {
            case SIDE.RIGHT:
            case SIDE.LEFT:
                if (this._prevScene!==undefined) this._prevScene.pos.setX(val);
                break;
            case SIDE.TOP:
            case SIDE.BOTTOM:
                if (this._prevScene!==undefined) this._prevScene.pos.setY(val);
                break;
        }
    }

    protected describe(): SceneProgressDescription {

        let from:number = 0, to:number = 0;
        switch (this.sideTo) {
            case SIDE.BOTTOM:
                from = 0;
                to = this.game.height;
                break;
            case SIDE.TOP:
                from = 0;
                to = -this.game.height;
                break;
            case SIDE.LEFT:
                from = 0;
                to = -this.game.width;
                break;
            case SIDE.RIGHT:
                from = 0;
                to = this.game.width;
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