import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Rect} from "@engine/geometry/rect";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {Optional} from "@engine/core/declarations";
import {Scene} from "@engine/scene/scene";

export abstract class AbstractCellsAppearingTransition extends AbstractSceneTransition {

    private val:number;

    private lockingRect:Rect = new Rect();

    constructor(
        protected readonly game:Game,
        protected readonly time:number = 1000,
        protected numOfCellsX:number = 6,
        protected numOfCellsY:number = 6,
        protected readonly easeFn:EaseFn = EasingLinear)
    {
        super();
    }



    public complete(): void {
        if (this._currScene!==undefined) {
            this._currScene.lockingRect = undefined;
        }
        if (this._prevScene!==undefined) {
            this._prevScene.lockingRect = undefined;
        }
        super.complete();
    }

    protected abstract getFromTo():{from:number,to:number};


    protected renderScenes(a:Optional<Scene>,b:Optional<Scene>): void {

        if (b!==undefined) b.render();

        if (a!==undefined) {

            const cellWidth:number = a.size.width/this.numOfCellsX;
            const cellHeight:number = a.size.height/this.numOfCellsY;
            const total:number = this.numOfCellsX*this.numOfCellsY;

            let progress:number=0;
            for (let y:number = 0; y < this.numOfCellsY; y++) {
                for (let x:number = 0; x < this.numOfCellsX; x++) {
                    progress++;
                    const currProgressRelative:number = progress/total*100;
                    if (currProgressRelative<this.val) {
                        this.lockingRect.setXYWH(x*cellWidth,y*cellHeight,cellWidth+1,cellHeight+1);
                        a.lockingRect = this.lockingRect;
                        a.render();
                    }
                }
            }
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

export class CellsAppearingTransition extends AbstractCellsAppearingTransition {
    public getOppositeTransition(): ISceneTransition {
        return new CellsDisappearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    public render(): void {
        this.renderScenes(this._currScene,this._prevScene);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: 100};
    }
}

export class CellsDisappearingTransition extends AbstractCellsAppearingTransition {
    public getOppositeTransition(): ISceneTransition {
        return new CellsAppearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    public render(): void {
        this.renderScenes(this._prevScene,this._currScene);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 100,to: 0};
    }
}