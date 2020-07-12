import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {MathEx} from "@engine/misc/mathEx";
import {AbstractCellsAppearingTransition} from "@engine/scene/transition/appear/cells/abstractCellsAppearingTransition";

abstract class RandomCellsAppearingDisappearingTransition extends AbstractCellsAppearingTransition{

    protected prepareIndicesArray(): void {
        this._indicesToShow.forEach((it,i)=>this._indicesToShow[i] = i);
        this._indicesToShow.sort(it=>MathEx.randomInt(-10,10)>0?1:-1);
    }

}

export class RandomCellsAppearingTransition extends RandomCellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new RandomCellsDisappearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: this.numOfCellsX*this.numOfCellsY};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }
}

export class RandomCellsDisappearingTransition extends RandomCellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new RandomCellsAppearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: this.numOfCellsX*this.numOfCellsY,to: 0};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }
}
