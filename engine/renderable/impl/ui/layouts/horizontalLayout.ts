import {AbstractLayout} from "@engine/renderable/impl/ui/layouts/abstracts/abstractLayout";

export class HorizontalLayout extends AbstractLayout {

    protected override onCleared() {
        super.onCleared();
        let pointer = 0;
        this.children.forEach(c=>{
            c.pos.setXY(pointer,0);
            pointer+=c.size.width;
        });
    }

}
