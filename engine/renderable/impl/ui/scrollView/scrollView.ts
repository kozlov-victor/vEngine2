import {Container} from "@engine/renderable/impl/ui/container";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ScrollContainerDelegate} from "@engine/renderable/impl/ui/scrollBar/scrollContainerDelegate";
import {Game} from "@engine/core/game";
import {NoOverflowSurface} from "@engine/renderable/impl/surface/noOverflowSurface";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {IRectJSON} from "@engine/geometry/rect";

export class ScrollView extends Container {

    private readonly _constrainContainer: RenderableModel;
    public readonly scrollableContainer: RenderableModel;
    private _scrollContainerDelegate:ScrollContainerDelegate;

    constructor(protected game: Game) {
        super(game);
        this.size.setWH(64,64);

        this._constrainContainer = new NoOverflowSurface(this.game,this.size);
        this._constrainContainer.size.set(this.size);
        this.appendChild(this._constrainContainer);

        this.scrollableContainer = new NullGameObject(this.game);
        this.scrollableContainer.size.set(this.size);
        this._constrainContainer.appendChild(this.scrollableContainer);
    }


    public revalidate() {
        super.revalidate();
        const clientRect:Readonly<IRectJSON> = this.getClientRect();
        this._constrainContainer.pos.set(clientRect);
        this._constrainContainer.size.set(clientRect);
        if (this._constrainContainer.size.isZero()) this._constrainContainer.size.set(this.size);
        if (this._scrollContainerDelegate===undefined) {
            this._scrollContainerDelegate = new ScrollContainerDelegate(this.game,this,this._constrainContainer,this.scrollableContainer);
        }
        this._scrollContainerDelegate.revalidate();
    }

    public update() {
        super.update();
        this._scrollContainerDelegate.update();
    }

}
