import {Game} from "@engine/core/game";
import {
    AbstractDirectionalList
} from "@engine/renderable/impl/ui/scrollViews/directional/_internal/abstractDirectionalList";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";


export class VerticalList extends AbstractDirectionalList {

    protected _direction: Direction = Direction.VERTICAL;

    protected _getCurrentScrollOffset(): number {
        return this._scrollContainerDelegate.getCurrentOffsetVertical();
    }

    constructor(game:Game) {
        super(game);
    }

}
