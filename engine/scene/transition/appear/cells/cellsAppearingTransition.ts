import {
    AbstractSceneTransition,
    SceneProgressDescription
} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {Image} from "@engine/renderable/impl/general/image";

export abstract class AbstractCellsAppearingTransition extends AbstractSceneTransition {

    private readonly _cells:Image[] = [];

    constructor(
        protected readonly game:Game,
        protected readonly time:number = 1000,
        protected numOfCellsX:number = 6,
        protected numOfCellsY:number = 6,
        protected readonly easeFn:EaseFn = EasingLinear)
    {
        super(game);
        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        this._transitionScene.appendChild(imageOnBottom);

        const cellWidth:number = this.game.size.width/this.numOfCellsX;
        const cellHeight:number = this.game.size.height/this.numOfCellsY;
        for (let y:number = 0; y < this.numOfCellsY; y++) {
            for (let x:number = 0; x < this.numOfCellsX; x++) {
                const image:Image = imageOnTop.clone();
                this._transitionScene.appendChild(image);
                this._cells.push(image);
                image.getSrcRect().setXYWH(x*cellWidth,y*cellHeight,cellWidth+1,cellHeight+1);
                image.size.setWH(cellWidth,cellHeight);
                image.pos.setXY(x*cellWidth,y*cellHeight);
            }
        }
    }

    protected abstract getFromTo():{from:number,to:number};

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
        let i:number = 0;
        for (let y:number = 0; y < this.numOfCellsY; y++) {
            for (let x:number = 0; x < this.numOfCellsX; x++) {
                const currProgressRelative:number = i/this._cells.length*100;
                this._cells[i].visible = currProgressRelative<=val;
                i++;
            }
        }
    }

    protected abstract getBottomAndTopImages():[Image,Image];

}

export class CellsAppearingTransition extends AbstractCellsAppearingTransition {
    public getOppositeTransition(): ISceneTransition {
        return new CellsDisappearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 0,to: 100};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage,this._currSceneImage];
    }
}

export class CellsDisappearingTransition extends AbstractCellsAppearingTransition {

    public getOppositeTransition(): ISceneTransition {
        return new CellsAppearingTransition(this.game,this.time,this.numOfCellsX,this.numOfCellsY,this.easeFn);
    }

    protected getFromTo(): { from: number; to: number } {
        return {from: 100,to: 0};
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

}
