import {AbstractCellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {MathEx} from "@engine/misc/mathEx";

abstract class RandomCellsAppearingDisappearingTransition extends AbstractCellsAppearingTransition{

    private readonly _indicesToShow:number[];

    constructor(protected readonly game:Game,
                protected readonly time:number = 1000,
                protected numOfCellsX:number = 6,
                protected numOfCellsY:number = 6,
                protected readonly easeFn:EaseFn = EasingLinear) {
        super(game,time,numOfCellsX,numOfCellsY,easeFn);
        this._indicesToShow = new Array(this._cells.length).fill(0).map((it,i)=>i);
        this._indicesToShow.sort(it=>MathEx.randomInt(-10,10)>0?1:-1);
    }


    protected onTransitionProgress(val: number): void {
        let i:number = 0;
        const currProgressIndex:number = ~~(val/100*this._cells.length);
        for (let y:number = 0; y < this.numOfCellsY; y++) {
            for (let x:number = 0; x < this.numOfCellsX; x++) {
                this._cells[i].visible = this._indicesToShow[i]<=currProgressIndex;
                i++;
            }
        }
    }

}

export class RandomCellsAppearingTransition extends RandomCellsAppearingDisappearingTransition {
    public getOppositeTransition(): ISceneTransition {
        return new RandomCellsDisapearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: 100};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }
}

export class RandomCellsDisapearingTransition extends RandomCellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new RandomCellsAppearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 100,to: 1};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }
}
