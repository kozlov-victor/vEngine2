import {AbstractLayout} from "@engine/renderable/impl/ui/layouts/abstracts/abstractLayout";

export class VerticalLayout extends AbstractLayout {

    protected override onCleared() {
        super.onCleared();
        let pointer = 0;
        this.children.forEach(c=>{
            c.pos.setXY(0,pointer);
            pointer+=c.size.height;
        });
    }

}
