import {AbstractLayout} from "@engine/renderable/impl/ui/layouts/abstracts/abstractLayout";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class LinearLayout extends AbstractLayout {

    protected override onCleared() {
        super.onCleared();
        const clientRect = this.getClientRect();
        let x = clientRect.x;
        let y = clientRect.y;
        let maxRowHeight = 0;
        this.iterateChildren((c:RenderableModel)=>{
            const canBePlacedToThisRow = x+c.size.width<=clientRect.x+clientRect.width;
            if (!canBePlacedToThisRow) {
                x = clientRect.x;
                y+=maxRowHeight;
                maxRowHeight = c.size.height;
            }
            if (maxRowHeight<c.size.height) maxRowHeight = c.size.height;
            c.pos.setXY(x,y);
            x+=c.size.width;
        });
    }

}
