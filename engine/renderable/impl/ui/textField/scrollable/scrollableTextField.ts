import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {ScrollContainerDelegate} from "@engine/renderable/impl/ui/scrollBar/scrollContainerDelegate";


export class ScrollableTextField extends TextField {

    public readonly type:string = 'ScrollableTextField';

    private _scrollContainerDelegate:ScrollContainerDelegate;

    constructor(game:Game,font:Font) {
        super(game,font);
    }

    revalidate() {
        super.revalidate();
        if (this._scrollContainerDelegate===undefined || this.rowSetContainer.isDirty()) {
            if (this._scrollContainerDelegate!==undefined) this._scrollContainerDelegate.destroy();
            this._scrollContainerDelegate = new ScrollContainerDelegate(this.game,this,this.rowSetContainer,this.rowSet);
            this._scrollContainerDelegate.onScroll(()=>this.requestTextRedraw());
        }
        this._scrollContainerDelegate.revalidate();
    }

    public update():void {
        super.update();
        this._scrollContainerDelegate.update();
    }

}

