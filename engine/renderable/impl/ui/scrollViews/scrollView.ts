import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";
import {ScrollContainerDelegate} from "@engine/renderable/impl/ui/scrollBar/scrollContainerDelegate";
import {Game} from "@engine/core/game";
import {NoOverflowSurface} from "@engine/renderable/impl/surface/noOverflowSurface";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {IRectJSON} from "@engine/geometry/rect";

export class ScrollView extends WidgetContainer {

    private readonly _constrainContainer: NoOverflowSurface;
    public readonly _scrollableContainer: SimpleGameObjectContainer;
    protected _scrollContainerDelegate: ScrollContainerDelegate;

    constructor(game: Game) {
        super(game);
        this.size.setWH(64, 64);

        this._constrainContainer = new NoOverflowSurface(this.game, this.size);
        this._constrainContainer.size.set(this.size);
        super.appendChild(this._constrainContainer);

        this._scrollableContainer = new SimpleGameObjectContainer(this.game);
        this._scrollableContainer.size.observe(()=>this.markAsDirty());
        this._scrollableContainer.size.set(this.size);
        this._constrainContainer.appendChild(this._scrollableContainer);
    }

    public override revalidate():void {
        super.revalidate();
        const clientRect: Readonly<IRectJSON> = this.getClientRect();
        this._constrainContainer.pos.set(clientRect);
        this._constrainContainer.size.set(clientRect);
        if (this._constrainContainer.size.isZero()) this._constrainContainer.size.set(this.size);
        if (this._scrollContainerDelegate === undefined) {
            this._scrollContainerDelegate =
                new ScrollContainerDelegate(this.game, this, this._constrainContainer, this._scrollableContainer);
        }
        this._scrollContainerDelegate.revalidate();
    }

    public override update():void {
        super.update();
        this._scrollContainerDelegate.update();
    }

}
