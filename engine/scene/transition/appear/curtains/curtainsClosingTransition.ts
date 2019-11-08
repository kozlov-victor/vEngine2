import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "../../abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {ISceneTransition} from "../../abstract/iSceneTransition";
import {Rect} from "@engine/geometry/rect";
import {CurtainsOpeningTransition} from "./curtainsOpeningTransition";

export class CurtainsClosingTransition extends AbstractSceneTransition {

    private progress:number = 0;
    private lockingRect:Rect = new Rect();

    constructor(
        private readonly game:Game,
        private readonly time:number = 1000,
        private readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }

    public render(): void {
        if (this._prevScene!==undefined) this._prevScene.render();
        // left curtain
        this._currScene.pos.setX(this.progress);
        this.lockingRect.setXYWH(this.progress,0,this._currScene.size.width/2,this._currScene.size.height);
        this._currScene.lockingRect = this.lockingRect;
        this._currScene.render();
        // right curtain
        this._currScene.pos.setX(-this.progress);
        this.lockingRect.setXYWH(-this.progress+this._currScene.size.width/2,0,this._currScene.size.width/2,this._currScene.size.height);
        this._currScene.lockingRect = this.lockingRect;
        this._currScene.render();
    }

    public complete(): void {
        super.complete();
        this._currScene.pos.setXY(0);
        this._currScene.lockingRect = undefined;
    }

    public getOppositeTransition(): ISceneTransition {
        return new CurtainsOpeningTransition(this.game,this.time,this.easeFn);
    }

    protected onTransitionProgress(val:number): void {
        this.progress = val;
    }

    protected describe(): SceneProgressDescription {
        const from:number = -this.game.width/2;
        const to:number = 0;
        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }

}