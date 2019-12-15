import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {Optional} from "@engine/core/declarations";
import {Scene} from "@engine/scene/scene";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Rect} from "@engine/geometry/rect";

export abstract class AbstractScaleAppearanceTransition extends AbstractSceneTransition {

    private val:number;
    private lockingRect:Rect = new Rect();

    constructor(
        protected readonly game:Game,
        protected readonly time:number = 1000,
        protected readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }



    public complete(): void {
        if (this._currScene!==undefined) {
            this._currScene.scale.setXY(1);
            this._currScene.transformPoint.setXY(0);
            this._currScene.lockingRect = undefined;
        }
        if (this._prevScene!==undefined) {
            this._prevScene.scale.setXY(1);
            this._prevScene.transformPoint.setXY(0);
            this._prevScene.lockingRect = undefined;
        }
        super.complete();
    }

    protected abstract getFromTo():{from:number,to:number};


    protected renderScenes(a:Optional<Scene>,b:Optional<Scene>): void {
        if (b!==undefined) {
            b.render();
        }
        if (a!==undefined) {
            const dx:number = a.size.width/2, dy:number = a.size.height/2;
            a.transformPoint.setXY(dx,dy);
            a.scale.setXY(this.val);
            const valInv:number = 1 - this.val;
            this.lockingRect.setXYWH(dx*valInv,dy*valInv,a.size.width*this.val,a.size.height*this.val);
            a.lockingRect = this.lockingRect;
            a.render();
        }
    }

    protected describe(): SceneProgressDescription {
        const from:number = this.getFromTo().from;
        const to:number = this.getFromTo().to;
        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }

    protected onTransitionProgress(val: number): void {
        this.val = val;
    }

}

export class ScaleInAppearanceTransition extends AbstractScaleAppearanceTransition {
    public getOppositeTransition(): ISceneTransition {
        return new ScaleOutAppearanceTransition(this.game,this.time,this.easeFn);
    }

    public render(): void {
        this.renderScenes(this._currScene,this._prevScene);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: 1};
    }
}

export class ScaleOutAppearanceTransition extends AbstractScaleAppearanceTransition {
    public getOppositeTransition(): ISceneTransition {
        return new ScaleInAppearanceTransition(this.game,this.time,this.easeFn);
    }

    public render(): void {
        this.renderScenes(this._prevScene,this._currScene);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 1,to: 0};
    }
}