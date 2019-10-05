import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {SIDE} from "@engine/scene/transition/side";
import {DebugError} from "@engine/debug/debugError";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export class SlideTransition extends AbstractSceneTransition {

    private from:number;

    constructor(
        private readonly game:Game,
        private readonly sideTo:SIDE = SIDE.BOTTOM,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }

    public render(): void {
        if (this._prevScene!==undefined) this._prevScene.render();
        this._currScene.render();
    }

    public complete(): void {
        super.complete();
        this._currScene.pos.setXY(0);
    }

    protected onTransitionProgress(val:number): void {
        switch (this.sideTo) {
            case SIDE.RIGHT:
            case SIDE.LEFT:
                this._currScene.pos.setX(val);
                if (this._prevScene!==undefined) this._prevScene.pos.setX(val-this.from);
                break;
            case SIDE.TOP:
            case SIDE.BOTTOM:
                this._currScene.pos.setY(val);
                if (this._prevScene!==undefined) this._prevScene.pos.setY(val-this.from);
                break;
        }
    }

    protected describe(): SceneProgressDescription {

        let from:number = 0, to:number = 0;
        switch (this.sideTo) {
            case SIDE.BOTTOM:
                from = -this.game.height;
                to = 0;
                break;
            case SIDE.TOP:
                from = this.game.height;
                to = 0;
                break;
            case SIDE.LEFT:
                from = this.game.width;
                to = 0;
                break;
            case SIDE.RIGHT:
                from = -this.game.width;
                to = 0;
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown side: ${this.sideTo}`);
                break;
        }
        this.from = from;

        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }


}