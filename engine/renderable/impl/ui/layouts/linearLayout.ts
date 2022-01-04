import {MarkableGameObjectContainer} from "@engine/renderable/impl/ui/textField/_internal/markableGameObjectContainer";
import {Game} from "@engine/core/game";

export class LinearLayout extends MarkableGameObjectContainer {

    constructor(game:Game) {
        super(game);
        this._parentChildDelegate.afterChildAppended =
            this._parentChildDelegate.afterChildRemoved =
                _ => this.markAsDirty();
    }

    protected override onCleared() {
        super.onCleared();
        let x = 0;
        let y = 0;
        let maxRowHeight = 0;
        this.children.forEach(c=>{
            const canBePlacedToThisRow = x+c.size.width<this.size.width;
            if (!canBePlacedToThisRow) {
                x = 0;
                y+=maxRowHeight;
                maxRowHeight = c.size.height;
            }
            if (maxRowHeight<c.size.height) maxRowHeight = c.size.height;
            c.pos.setXY(x,y);
            x+=c.size.width;
        });
    }

}
