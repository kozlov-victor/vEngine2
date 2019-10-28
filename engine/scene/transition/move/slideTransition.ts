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

export class SlideTransition extends AbstractSceneTransition {

    private lockingRect:Rect = new Rect();
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
        if (this._prevScene!==undefined) {
            const s = this._prevScene;
            this.lockingRect.setXYWH(s.pos.x,s.pos.y,s.size.width,s.size.height);
            s.lockingRect = this.lockingRect;
            s.render();
        }

        const scene:Scene = this._currScene;
        this.lockingRect.setXYWH(scene.pos.x,scene.pos.y,scene.size.width,scene.size.height);
        scene.lockingRect = this.lockingRect;
        scene.render();
    }

    public complete(): void {
        super.complete();
        this._currScene.pos.setXY(0);
        this._currScene.lockingRect = undefined;
        if (this._prevScene!==undefined) this._prevScene.lockingRect = undefined;
    }

    public getOppositeTransition(): ISceneTransition {
        return new SlideTransition(this.game,OPPOSITE_SIDE.resolve(this.sideTo),this.time,this.easeFn);
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