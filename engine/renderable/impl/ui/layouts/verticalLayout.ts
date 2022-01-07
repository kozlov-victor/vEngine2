import {AbstractLayout} from "@engine/renderable/impl/ui/layouts/abstracts/abstractLayout";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class VerticalLayout extends AbstractLayout {

    protected override onCleared() {
        super.onCleared();
        const clientRect = this.getClientRect();
        let pointer = clientRect.y;
        this.iterateChildren((c:RenderableModel)=>{
            c.pos.setXY(clientRect.x,pointer);
            pointer+=c.size.height;
        });
    }

}
