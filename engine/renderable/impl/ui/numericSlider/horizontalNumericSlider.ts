import {AbstractNumericSlider} from "@engine/renderable/impl/ui/numericSlider/_intrtnal/abstractNumericSlider";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";
import {IDraggableBehaviourParameters} from "@engine/behaviour/impl/draggable";

export class HorizontalNumericSlider extends AbstractNumericSlider {

    protected direction:Direction = Direction.HORIZONTAL;
    protected draggableConstrains:IDraggableBehaviourParameters = {
        constrainY:true
    };

    protected onClientRectChanged():void {
        const clientRect = this.getClientRect();
        this.draggableConstrains.minX = clientRect.x;
        this.draggableConstrains.maxX = this.getClientRect().width - this.handler.size.width + clientRect.x;
        super.onClientRectChanged();
    }

}
