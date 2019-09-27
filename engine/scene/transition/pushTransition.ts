import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {EaseFn, ITweenDescription} from "@engine/animation/tween";
import {Easing} from "@engine/misc/easing/linear";
import {Game} from "@engine/core/game";
import {SIDE} from "@engine/scene/transition/side";
import {DebugError} from "@engine/debug/debugError";

export class PushTransition extends AbstractSceneTransition {

    constructor(
        private readonly game:Game,
        private readonly sideTo:SIDE = SIDE.BOTTOM,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = Easing.linear)
    {
        super();
    }

    public render(): void {
        if (this._prevScene!==undefined) this._prevScene.render();
        this._currScene.render();
    }

    protected onTransitionProgress(val:number): void {
        switch (this.sideTo) {
            case SIDE.RIGHT:
            case SIDE.LEFT:
                this._currScene.pos.setX(val);
                break;
            case SIDE.TOP:
            case SIDE.BOTTOM:
                this._currScene.pos.setY(val);
                break;
        }
    }

    protected onTransitionCompleted(): void {
        this._currScene.pos.setXY(0);
    }

    protected onTweenCreated(): ITweenDescription {

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

        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn,
            progress: (obj: { val: number }) => {
                this.onTransitionProgress(obj.val);
            },
            complete: () => {
                this.onTransitionCompleted();
                this._onComplete();
            }
        };
    }


}