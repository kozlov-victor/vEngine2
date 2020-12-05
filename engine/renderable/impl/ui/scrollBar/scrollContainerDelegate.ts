import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {
    HorizontalScrollContainerListener,
    VerticalScrollContainerListener
} from "@engine/renderable/impl/ui/scrollBar/_internal/scrollContainerListener";
import {VerticalScrollBar} from "@engine/renderable/impl/ui/scrollBar/verticalScrollBar";
import {HorizontalScrollBar} from "@engine/renderable/impl/ui/scrollBar/horizontalScrollBar";
import {Game} from "@engine/core/game";
import {Container} from "@engine/renderable/impl/ui/container";

export class ScrollContainerDelegate {

    private vScrollContainerListener:VerticalScrollContainerListener;
    private hScrollContainerListener:HorizontalScrollContainerListener;

    private readonly vScrollBar: VerticalScrollBar;
    private readonly hScrollBar: HorizontalScrollBar;

    private _onScroll:()=>void = ()=>{};

    constructor(
        private game:Game,
        private rootContainer:Container,
        private constrainContainer:RenderableModel,
        private scrollableContainer:RenderableModel)
    {
        this.vScrollBar = new VerticalScrollBar(this.game);
        this.hScrollBar = new HorizontalScrollBar(this.game);
        this.constrainContainer.appendChild(this.vScrollBar);
        this.constrainContainer.appendChild(this.hScrollBar);
    }

    public onScroll(cb:()=>void):void {
        this._onScroll = cb;
    }

    public revalidate():void {

        if (this.vScrollContainerListener===undefined) {
            this.vScrollContainerListener = new VerticalScrollContainerListener(this.constrainContainer,this.scrollableContainer);
            this.vScrollContainerListener.onScroll(()=>{
                this.updateScrollValues();
                this._onScroll();
            });
        }
        if (this.hScrollContainerListener===undefined) {
            this.hScrollContainerListener = new HorizontalScrollContainerListener(this.constrainContainer,this.scrollableContainer);
            this.hScrollContainerListener.setMouseScroll(false);
            this.hScrollContainerListener.onScroll(()=>{
                this.updateScrollValues();
                this._onScroll();
            });
        }

        this.vScrollBar.size.setWH(5,this.constrainContainer.size.height);
        this.vScrollBar.pos.x = this.constrainContainer.size.width - this.vScrollBar.size.width + this.rootContainer.paddingRight;
        this.hScrollBar.size.setWH(this.constrainContainer.size.width,5);
        this.updateScrollValues();
    }

    public update():void {
        const delta:number = this.game.getDeltaTime();
        this.vScrollContainerListener.update(delta);
        this.hScrollContainerListener.update(delta);
    }

    public destroy(){
        if (this.vScrollContainerListener!==undefined) this.vScrollContainerListener.destroy();
        if (this.hScrollContainerListener!==undefined) this.hScrollContainerListener.destroy();
        this.vScrollBar.removeSelf();
        this.hScrollBar.removeSelf();
    }

    private updateScrollValues():void {
        this.vScrollBar.maxValue = this.scrollableContainer.size.height;
        this.vScrollBar.value = - this.vScrollContainerListener.getScrollPosition();

        this.hScrollBar.maxValue = this.scrollableContainer.size.width;
        this.hScrollBar.value = - this.hScrollContainerListener.getScrollPosition();

    }

}
