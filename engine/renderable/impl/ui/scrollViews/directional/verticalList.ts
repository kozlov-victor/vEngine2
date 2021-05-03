import {Game} from "@engine/core/game";
import {AbstractDirectionalList} from "@engine/renderable/impl/ui/scrollViews/directional/_internal/abstractDirectionalList";
import {Direction} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";


export class VerticalList extends AbstractDirectionalList {

    protected direction: Direction = Direction.VERTICAL;

    protected getCurrentScrollOffset(): number {
        return this._scrollContainerDelegate.getCurrentOffsetVertical();
    }

    constructor(protected game:Game) {
        super(game);
    }

}
