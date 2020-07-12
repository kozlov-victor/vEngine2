import {AbstractSceneTransition} from "@engine/scene/transition/abstract/abstractSceneTransition";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";

export abstract class AbstractCellsAppearingTransition extends AbstractSceneTransition {

    protected readonly _cells:Image[] = [];
    protected readonly _indicesToShow:number[];

    constructor(
        protected readonly game:Game,
        protected readonly time:number = 1000,
        protected numOfCellsX:number = 6,
        protected numOfCellsY:number = 6,
        protected readonly easeFn:EaseFn = EasingLinear)
    {
        super(game,time,easeFn);
        const [imageOnBottom,imageOnTop] = this.getBottomAndTopImages();
        this._transitionScene.appendChild(imageOnBottom);

        const cellWidth:number = this.game.size.width/this.numOfCellsX;
        const cellHeight:number = this.game.size.height/this.numOfCellsY;
        for (let y:number = 0; y < this.numOfCellsY; y++) {
            for (let x:number = 0; x < this.numOfCellsX; x++) {
                const image:Image = imageOnTop.clone();
                this._transitionScene.appendChild(image);
                this._cells.push(image);
                image.getSrcRect().setXYWH(x*cellWidth,y*cellHeight,cellWidth,cellHeight);
                image.size.setWH(cellWidth,cellHeight);
                image.pos.setXY(x*cellWidth,y*cellHeight);
            }
        }
        this._indicesToShow = new Array(this._cells.length).fill(0);
        this.prepareIndicesArray();
    }

    protected onTransitionProgress(val: number): void {
        let i:number = 0;
        for (let y:number = 0; y < this.numOfCellsY; y++) {
            for (let x:number = 0; x < this.numOfCellsX; x++) {
                this._cells[i].visible = this._indicesToShow[i]<=val;
                i++;
            }
        }
    }

    protected abstract getBottomAndTopImages():[Image,Image];

    protected abstract prepareIndicesArray():void;

}
