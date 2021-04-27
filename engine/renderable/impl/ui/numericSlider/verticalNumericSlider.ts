import {AbstractNumericSlider} from "@engine/renderable/impl/ui/numericSlider/_intrtnal/abstractNumericSlider";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";
import {IDraggableBehaviourParameters} from "@engine/behaviour/impl/draggable";

export class VerticalNumericSlider extends AbstractNumericSlider{
    protected direction:Direction = Direction.VERTICAL;
    protected draggableConstrains:IDraggableBehaviourParameters = {
        constrainX:true
    };

    protected onClientRectChanged():void {
        const clientRect = this.getClientRect();
        this.draggableConstrains.minY = clientRect.y;
        this.draggableConstrains.maxY = this.getClientRect().height - this.handler.size.height + clientRect.y;
        super.onClientRectChanged();
    }
}
