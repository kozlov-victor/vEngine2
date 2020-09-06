import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {VerticalScrollContainerListener} from "@engine/renderable/impl/ui/_internal/verticalScrollContainerListener";
import {VerticalScrollBar} from "@engine/renderable/impl/ui/verticalScrollBar";


export class ScrollableTextField extends TextField {

    public readonly type:string = 'ScrollableTextField';

    private scrollContainerListener:VerticalScrollContainerListener;
    private readonly scrollBar: VerticalScrollBar;

    constructor(game:Game,font:Font) {
        super(game,font);
        this.scrollBar = new VerticalScrollBar(this.game);
        this.rowSetContainer.appendChild(this.scrollBar);
    }

    revalidate() {
        super.revalidate();
        if (this.scrollContainerListener===undefined || this.rowSetContainer.isDirty()) {
            if (this.scrollContainerListener!==undefined) this.scrollContainerListener.destroy();
            this.scrollContainerListener = new VerticalScrollContainerListener(this.rowSetContainer,this.rowSet);
            this.scrollContainerListener.onScroll(()=>{
                this.updateScrollValues();
                this.requestTextRedraw();
            });
        }
        this.scrollBar.size.setWH(5,this.rowSetContainer.size.height);
        this.scrollBar.pos.x = this.rowSetContainer.size.width - this.scrollBar.size.width + this.paddingRight;
        this.updateScrollValues();
    }

    public update():void {
        super.update();
        const delta:number = this.game.getDeltaTime();
        this.scrollContainerListener.update(delta);
    }

    private updateScrollValues():void {
        this.scrollBar.maxValue = this.rowSet.size.height;
        this.scrollBar.value = - this.scrollContainerListener.getScrollPosition();
    }


}
