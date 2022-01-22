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
            if (i<=WidgetContainer.INTERNAL_CHILD_OFFSET_INDEX-1) return;
            cb(c);
        });
    }

    public override getChildrenCount(): number {
        return super.getChildrenCount() - WidgetContainer.INTERNAL_CHILD_OFFSET_INDEX;
    }

    public override getChildAt(index: number): this {
        return super.getChildAt(index + WidgetContainer.INTERNAL_CHILD_OFFSET_INDEX);
    }
}
