import {AbstractLayout} from "@engine/renderable/impl/ui/layouts/abstracts/abstractLayout";

export class LinearLayout extends AbstractLayout {


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
