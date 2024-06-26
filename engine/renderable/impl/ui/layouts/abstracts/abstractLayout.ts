import {Game} from "@engine/core/game";
import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export abstract class AbstractLayout extends WidgetContainer {
    constructor(game:Game) {
        super(game);
        this._parentChildDelegate.afterChildAppended =
            this._parentChildDelegate.afterChildRemoved =
                _ => this.markAsDirty();
    }

    protected iterateChildren(cb:(c:RenderableModel)=>void):void {
        this._children.forEach((c, i)=>{
            if (i<=this.INTERNAL_CHILD_OFFSET_INDEX-1) return;
            cb(c);
        });
    }

}
