import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {
    HorizontalScrollContainerListener,
    VerticalScrollContainerListener
} from "@engine/renderable/impl/ui/scrollBar/_internal/verticalScrollContainerListener";
import {VerticalScrollBar} from "@engine/renderable/impl/ui/scrollBar/verticalScrollBar";
import {HorizontalScrollBar} from "@engine/renderable/impl/ui/scrollBar/horizontalScrollBar";


export class ScrollableTextField extends TextField {

    public readonly type:string = 'ScrollableTextField';

    private vScrollContainerListener:VerticalScrollContainerListener;
    private hScrollContainerListener:HorizontalScrollContainerListener;
    private readonly vScrollBar: VerticalScrollBar;
    private readonly hScrollBar: HorizontalScrollBar;

    constructor(game:Game,font:Font) {
        super(game,font);
        this.vScrollBar = new VerticalScrollBar(this.game);
        this.hScrollBar = new HorizontalScrollBar(this.game);
        this.rowSetContainer.appendChild(this.vScrollBar);
        this.rowSetContainer.appendChild(this.hScrollBar);
    }

    revalidate() {
        super.revalidate();
        if (this.vScrollContainerListener===undefined || this.rowSetContainer.isDirty()) {
            if (this.vScrollContainerListener!==undefined) this.vScrollContainerListener.destroy();
            this.vScrollContainerListener = new VerticalScrollContainerListener(this.rowSetContainer,this.rowSet);
            this.vScrollContainerListener.onScroll(()=>{
                this.updateScrollValues();
                this.requestTextRedraw();
            });
        }
        if (this.hScrollContainerListener===undefined || this.rowSetContainer.isDirty()) {
            if (this.hScrollContainerListener!==undefined) this.hScrollContainerListener.destroy();
            this.hScrollContainerListener = new HorizontalScrollContainerListener(this.rowSetContainer,this.rowSet);
            this.hScrollContainerListener.setMouseScroll(false);
            this.hScrollContainerListener.onScroll(()=>{
                this.updateScrollValues();
                this.requestTextRedraw();
            });
        }

        this.vScrollBar.size.setWH(5,this.rowSetContainer.size.height);
        this.vScrollBar.pos.x = this.rowSetContainer.size.width - this.vScrollBar.size.width + this.paddingRight;
        this.hScrollBar.size.setWH(this.rowSetContainer.size.width,5);
        this.updateScrollValues();
    }

    public update():void {
        super.update();
        const delta:number = this.game.getDeltaTime();
        this.vScrollContainerListener.update(delta);
        this.hScrollContainerListener.update(delta);
    }

    private updateScrollValues():void {
        this.vScrollBar.maxValue = this.rowSet.size.height;
        this.vScrollBar.value = - this.vScrollContainerListener.getScrollPosition();

        this.hScrollBar.maxValue = this.rowSet.size.width;
        this.hScrollBar.value = - this.hScrollContainerListener.getScrollPosition();
    }


}
