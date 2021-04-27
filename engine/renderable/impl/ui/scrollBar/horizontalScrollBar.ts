import {AbstractScrollBar} from "@engine/renderable/impl/ui/scrollBar/_internal/abstractScrollBar";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";

export class HorizontalScrollBar extends AbstractScrollBar {
    public readonly type:string = 'HorizontalScrollBar';

    protected getDirection(): Direction {
        return Direction.HORIZONTAL;
    }

}
