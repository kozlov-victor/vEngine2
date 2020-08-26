import {TextField} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {VerticalScrollContainerListener} from "@engine/renderable/impl/ui2/_internal/verticalScrollContainerListener";
import {VerticalScrollBar} from "@engine/renderable/impl/ui2/verticalScrollBar";


export class ScrollableTextField extends TextField {

    public readonly type:string = 'ScrollableTextField';

    private scrollContainerListener:VerticalScrollContainerListener;
    private scrollBar: VerticalScrollBar;

    constructor(game:Game,font:Font) {
        super(game,font);
    }

    protected prepare() {
        super.prepare();
        this.scrollContainerListener = new VerticalScrollContainerListener(this.rowSetContainer,this.rowSet);
        this.scrollBar = new VerticalScrollBar(this.game);
        this.scrollBar.size.setWH(5,this.rowSetContainer.size.height);
        this.scrollBar.pos.x = this.rowSetContainer.size.width - this.scrollBar.size.width + this.paddingRight;
        this.rowSetContainer.appendChild(this.scrollBar);
        this.scrollContainerListener.onScroll(()=>this.redrawText());
    }

    public update():void {
        super.update();
        const delta:number = this.game.getDeltaTime();
        this.scrollContainerListener.update(delta);
    }

    protected redrawText() {
        this.scrollBar.maxValue = this.rowSet.size.height;
        this.scrollBar.value = - this.scrollContainerListener.getScrollPosition();
        super.redrawText();
    }


}
