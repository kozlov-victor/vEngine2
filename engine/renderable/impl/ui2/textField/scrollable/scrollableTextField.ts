import {TextField} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {VerticalScrollContainerListener} from "@engine/renderable/impl/ui2/_internal/verticalScrollContainerListener";


export class ScrollableTextField extends TextField {

    private scrollContainerListener:VerticalScrollContainerListener;

    constructor(game:Game,font:Font) {
        super(game,font);
    }

    protected prepare() {
        super.prepare();
        this.scrollContainerListener = new VerticalScrollContainerListener(this.rowSetContainer,this.rowSet);
    }

    public update():void {
        super.update();
        const delta:number = this.game.getDeltaTime();
        this.scrollContainerListener.update(delta);
    }


}
