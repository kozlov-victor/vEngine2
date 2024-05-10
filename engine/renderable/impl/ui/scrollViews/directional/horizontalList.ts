import {
    AbstractDirectionalList
} from "@engine/renderable/impl/ui/scrollViews/directional/_internal/abstractDirectionalList";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";
import {Game} from "@engine/core/game";

export class HorizontalList extends AbstractDirectionalList {
    protected override _direction: Direction = Direction.HORIZONTAL;

    protected override _getCurrentScrollOffset(): number {
        return this._scrollContainerDelegate.getCurrentOffsetHorizontal();
    }

    constructor(game:Game) {
        super(game);
    }
}
