import {AbstractCellsAppearingTransition} from "@engine/scene/transition/appear/cells/abstractCellsAppearingTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";

export abstract class SpiralCellsAppearingDisappearingTransition extends AbstractCellsAppearingTransition {

    private calcArrPositionByXY(x:number,y:number):number{
        return this.numOfCellsX * y + x;
    }

    // https://www.geeksforgeeks.org/print-a-given-matrix-in-spiral-form/
    protected prepareIndicesArray(): void {
        let i:number, k:number = 0, l:number = 0;
        let m:number = this.numOfCellsY - 1;
        let n:number = this.numOfCellsX - 1;
        /*  k - starting row index
        m - ending row index
        l - starting column index
        n - ending column index
        i - iterator
        */
        let cnt:number = 0;

        while (k < m && l < n) {
            // Print the first row from the remaining rows
            for (i = l; i < n; ++i) {
                this._indicesToShow[this.calcArrPositionByXY(k,i)] = cnt++;
            }
            k++;

            // Print the last column from the remaining columns
            for (i = k; i < m; ++i) {
                this._indicesToShow[this.calcArrPositionByXY(i,n-1)] = cnt++;
            }
            n--;

            // Print the last row from the remaining rows */
            if (k < m) {
                for (i = n - 1; i >= l; --i) {
                    this._indicesToShow[this.calcArrPositionByXY(m-1,i)] = cnt++;
                }
                m--;
            }

            // Print the first column from the remaining columns */
            if (l < n) {
                for (i = m - 1; i >= k; --i) {
                    this._indicesToShow[this.calcArrPositionByXY(i,l)] = cnt++;
                }
                l++;
            }
        }
    }
}

export class SpiralCellsAppearingTransition extends SpiralCellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new SpiralCellsDisappearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: this.numOfCellsX*this.numOfCellsY};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }
}

export class SpiralCellsDisappearingTransition extends SpiralCellsAppearingDisappearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new SpiralCellsAppearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: this.numOfCellsX*this.numOfCellsY,to: 0};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }
}
