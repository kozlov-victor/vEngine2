import {AbstractDirectionalList} from "@engine/renderable/impl/ui/scrollViews/directional/_internal/abstractDirectionalList";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";
import {Game} from "@engine/core/game";

export class HorizontalList extends AbstractDirectionalList {
    protected direction: Direction = Direction.HORIZONTAL;

    protected getCurrentScrollOffset(): number {
        return this._scrollContainerDelegate.getCurrentOffsetHorizontal();
    }

    constructor(protected game:Game) {
        super(game);
    }
}
