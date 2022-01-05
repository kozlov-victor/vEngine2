import {Game} from "@engine/core/game";
import {MarkableGameObjectContainer} from "@engine/renderable/impl/ui/textField/_internal/markableGameObjectContainer";

export abstract class AbstractLayout extends MarkableGameObjectContainer {
    constructor(game:Game) {
        super(game);
        this._parentChildDelegate.afterChildAppended =
            this._parentChildDelegate.afterChildRemoved =
                _ => this.markAsDirty();
    }
}
