import {AbstractScrollContainerListener} from "@engine/renderable/impl/ui/scrollBar/_internal/abstractScrollContainerListener";
import {Direction} from "@engine/renderable/impl/ui/scrollBar/_internal/sideHelperFunctions";

export class VerticalScrollContainerListener extends AbstractScrollContainerListener{

    public type:string = 'VerticalScrollContainerListener';

    protected getDirection(): Direction {
        return Direction.VERTICAL;
    }
}

export class HorizontalScrollContainerListener extends AbstractScrollContainerListener{

    public type:string = 'HorizontalScrollContainerListener';

    protected getDirection(): Direction {
        return Direction.HORIZONTAL;
    }

}
