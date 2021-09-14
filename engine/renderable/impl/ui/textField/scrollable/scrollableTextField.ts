import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {ScrollContainerDelegate} from "@engine/renderable/impl/ui/scrollBar/scrollContainerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";


export class ScrollableTextField extends TextField {

    public override readonly type:string = 'ScrollableTextField';

    public readonly scrollHandler:EventEmitterDelegate<'scroll', void> = new EventEmitterDelegate(this.game);

    private _scrollContainerDelegate:ScrollContainerDelegate;

    constructor(game:Game,font:Font) {
        super(game,font);
    }

    public override revalidate():void {
        super.revalidate();
        if (this._scrollContainerDelegate===undefined || this.rowSetContainer.isDirty()) {
            if (this._scrollContainerDelegate!==undefined) this._scrollContainerDelegate.destroy();
            this._scrollContainerDelegate = new ScrollContainerDelegate(this.game,this,this.rowSetContainer,this.rowSet);
            this._scrollContainerDelegate.onScroll(()=>{
                this.scrollHandler.trigger('scroll');
                this.requestTextRedraw();
            });
        }
        this._scrollContainerDelegate.revalidate();
    }

    public override update():void {
        super.update();
        this._scrollContainerDelegate.update();
    }

    public addOnScrollListener(cb:()=>void):void {
        this._scrollContainerDelegate.onScroll(cb);
    }

    public setCurrentOffsetVertical(val:number):void {
        this.rowSet.pos.y = val;
        this._scrollContainerDelegate.setCurrentOffsetVertical(val);
        this._scrollContainerDelegate.revalidate();
    }

    public setCurrentOffsetHorizontal(val:number):void {
        this.rowSet.pos.x = val;
        this._scrollContainerDelegate.setCurrentOffsetHorizontal(val);
        this._scrollContainerDelegate.revalidate();
    }

    public getCurrentOffsetVertical():number {
        return this._scrollContainerDelegate.getCurrentOffsetVertical();
    }

    public getCurrentOffsetHorizontal():number {
        return this._scrollContainerDelegate.getCurrentOffsetHorizontal();
    }

}

