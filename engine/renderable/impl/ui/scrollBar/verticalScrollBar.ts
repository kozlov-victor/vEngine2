import {AbstractScrollBar} from "@engine/renderable/impl/ui/scrollBar/_internal/abstractScrollBar";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";

export class VerticalScrollBar extends AbstractScrollBar {
    public readonly type:string = 'VerticalScrollBar';

    protected getDirection(): Direction {
        return Direction.VERTICAL;
    }

}

