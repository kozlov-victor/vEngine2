import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "../../abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "../../abstract/iSceneTransition";
import {Rect} from "@engine/geometry/rect";
import {CurtainsClosingTransition} from "@engine/scene/transition/appear/curtains/curtainsClosingTransition";

export class CurtainsOpeningTransition extends AbstractSceneTransition {

    private _progress:number = 0;
    private _lockingRect:Rect = new Rect();

    constructor(
        private readonly game:Game,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }

    public render(): void {
        this._currScene.render();
        if (this._prevScene!==undefined) {
            // left curtain
            this._prevScene.pos.setX(this._progress);
            this._lockingRect.setXYWH(this._progress,0,this._prevScene.size.width/2,this._prevScene.size.height);
            this._prevScene.lockingRect = this._lockingRect;
            this._prevScene.render();
            //right curtain
            this._prevScene.pos.setX(-this._progress);
            this._lockingRect.setXYWH(-this._progress+this._prevScene.size.width/2,0,this._prevScene.size.width/2,this._prevScene.size.height);
            this._prevScene.lockingRect = this._lockingRect;
            this._prevScene.render();
        }
    }

    public complete(): void {
        super.complete();
        if (this._prevScene!==undefined) {
            this._prevScene.pos.setXY(0);
            this._prevScene.lockingRect = undefined;
        }
        this._currScene.pos.setXY(0);
    }

    public getOppositeTransition(): ISceneTransition {
        return new CurtainsClosingTransition(this.game,this.time,this.easeFn);
    }

    protected onTransitionProgress(val:number): void {
        this._progress = val;
    }

    protected describe(): SceneProgressDescription {
        const from:number = 0;
        const to:number = -this.game.size.width/2;
        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }

}
