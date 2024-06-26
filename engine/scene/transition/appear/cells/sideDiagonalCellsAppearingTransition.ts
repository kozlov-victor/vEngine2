import {AbstractCellsAppearingTransition} from "@engine/scene/transition/appear/cells/abstractCellsAppearingTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image/image";

export abstract class SideDiagonalCellsAppearingDisappearingTransition extends AbstractCellsAppearingTransition {

    protected prepareIndicesArray(): void {
        let i:number = 0;
        const numOfDiagonals:number = this.numOfCellsX + this.numOfCellsY;
        for (let y:number = 0; y < this.numOfCellsY; y++) {
            for (let x:number = 0; x < this.numOfCellsX; x++) {
                this._indicesToShow[i] = ((this.numOfCellsX - x +  y)/numOfDiagonals)*this._indicesToShow.length;
                i++;
            }
        }
    }
}

export class  SideDiagonalCellsAppearingTransition extends SideDiagonalCellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new SideDiagonalCellsDisappearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: this.numOfCellsX*this.numOfCellsY};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }
}

export class  SideDiagonalCellsDisappearingTransition extends SideDiagonalCellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new SideDiagonalCellsAppearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: this.numOfCellsX*this.numOfCellsY,to: 0};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }
}
