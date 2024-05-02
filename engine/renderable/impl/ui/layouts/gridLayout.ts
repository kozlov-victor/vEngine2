import {AbstractLayout} from "@engine/renderable/impl/ui/layouts/abstracts/abstractLayout";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";

export class GridLayout extends AbstractLayout {

    constructor(game:Game, private numOfCells: number) {
        super(game);
    }

    protected override onCleared() {
        super.onCleared();
        const clientRect = this.getClientRect();
        const childrenCount = this._children.length - this.INTERNAL_CHILD_OFFSET_INDEX;
        const cellWith = clientRect.width/this.numOfCells;
        const numOfRows = (~~((childrenCount-1) / this.numOfCells))+1;
        const cellHeight = clientRect.height / numOfRows;
        let cellCnt = 0;
        let rowCnt = 0;
        this.iterateChildren((c:RenderableModel)=>{
            c.pos.setXY(cellCnt*cellWith,rowCnt*cellHeight);
            c.size.setWH(cellWith,cellHeight);
            cellCnt++;
            if (cellCnt===this.numOfCells) {
                cellCnt = 0;
                rowCnt++;
            }
        });
    }

}
