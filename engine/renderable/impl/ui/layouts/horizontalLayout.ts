import {AbstractLayout} from "@engine/renderable/impl/ui/layouts/abstracts/abstractLayout";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class HorizontalLayout extends AbstractLayout {

    protected override onCleared() {
        super.onCleared();
        const clientRect = this.getClientRect();
        let pointer = clientRect.x;
        this.iterateChildren((c:RenderableModel)=>{
            c.pos.setXY(pointer,clientRect.y);
            pointer+=c.size.width;
        });
    }

}
