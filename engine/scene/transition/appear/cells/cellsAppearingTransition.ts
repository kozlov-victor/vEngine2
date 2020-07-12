import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {AbstractCellsAppearingTransition} from "@engine/scene/transition/appear/cells/abstractCellsAppearingTransition";

abstract class CellsAppearingDisappearingTransition extends AbstractCellsAppearingTransition{

    protected prepareIndicesArray(): void {
        this._indicesToShow.forEach((it,i)=>this._indicesToShow[i] = i);
    }

}

export class CellsAppearingTransition extends CellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new CellsDisappearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: this.numOfCellsX*this.numOfCellsY};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }
}

export class CellsDisappearingTransition extends CellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new CellsAppearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: this.numOfCellsX*this.numOfCellsY,to: 0};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

}
