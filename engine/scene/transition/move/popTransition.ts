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
import {Rect} from "@engine/geometry/rect";
import {Scene} from "@engine/scene/scene";

export class PopTransition extends AbstractSceneTransition {

    private _lockingRect:Rect = new Rect();

    constructor(
        private readonly game:Game,
        private readonly sideTo:SIDE = SIDE.BOTTOM,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }

    public render(): void {
        this.game.camera.worldTransformDirty = true; // todo temporary solution
        this._lockingRect.setXYWH(this._currScene.pos.x,this._currScene.pos.y,this._currScene.size.width,this._currScene.size.height);
        this._currScene.render();
        if (this._prevScene!==undefined) {
            const scene:Scene = this._prevScene;
            this._lockingRect.setXYWH(scene.pos.x,scene.pos.y,scene.size.width,scene.size.height);
            scene.lockingRect = this._lockingRect;
            scene.render();
        }
    }

    public complete(): void {
        super.complete();
        if (this._prevScene!==undefined) {
            this._prevScene.pos.setXY(0);
            this._prevScene.lockingRect = undefined;
        }
        this._currScene.pos.setXY(0);
        this._currScene.lockingRect = undefined;
    }

    public getOppositeTransition(): ISceneTransition {
        return new PopTransition(this.game,OPPOSITE_SIDE.resolve(this.sideTo),this.time,this.easeFn);
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

(window as unknown as {Rect:typeof Rect}).Rect = Rect;
