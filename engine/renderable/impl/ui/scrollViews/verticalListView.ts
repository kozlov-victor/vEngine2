import {ScrollView} from "@engine/renderable/impl/ui/scrollViews/scrollView";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export enum LIST_VIEW_EVENTS {
    itemClick = 'itemClick'
}

export class ListViewItem {

    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    constructor(public view:RenderableModel) {
    }

    public off(event: LIST_VIEW_EVENTS, callBack: ()=>void): void {
        this._eventEmitterDelegate.off(event,callBack);
    }
    public on(event: LIST_VIEW_EVENTS, callBack: ()=>void): (arg?:any)=>void {
        return this._eventEmitterDelegate.on(event,callBack);
    }
    public once(event: LIST_VIEW_EVENTS, callBack: ()=>void):void {
        this._eventEmitterDelegate.once(event,callBack);
    }
    public trigger(event: LIST_VIEW_EVENTS): void {
        this._eventEmitterDelegate.trigger(event);
    }


}

export class VerticalListView extends ScrollView {

    private pointerY:number = 0;

    constructor(protected game:Game) {
        super(game);
    }

    public addView(listViewItem: ListViewItem):void {
        const newChild:RenderableModel = listViewItem.view;
        this.scrollableContainer.appendChild(newChild);
        newChild.pos.setY(this.pointerY);
        this.pointerY+=newChild.size.height;
        this.scrollableContainer.size.setH(this.pointerY);

        let lastOffset:number = 0;
        let captured:boolean = false;
        newChild.on(MOUSE_EVENTS.mouseDown, _=>{
            captured = true;
            lastOffset = this._scrollContainerDelegate.getCurrentOffsetVertical();
        });
        newChild.on(MOUSE_EVENTS.mouseUp, e=>{
            if (!captured) return; // if element is not captured, but mouseUp-ed (ie after scene transition) does not trigger event
            captured = false;
            const currentOffset:number = this._scrollContainerDelegate.getCurrentOffsetVertical();
            const delta:number = Math.abs(lastOffset - currentOffset);
            lastOffset = currentOffset;
            if (delta<10) listViewItem.trigger(LIST_VIEW_EVENTS.itemClick);
        });
    }

    protected empty():void {
        this.pointerY = 0;
        this.scrollableContainer.removeChildren();
    }


}
