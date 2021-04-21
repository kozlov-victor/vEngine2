import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {
    LIST_VIEW_EVENTS,
    ListViewItem,
    VerticalListView
} from "@engine/renderable/impl/ui/scrollViews/verticalListView";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {IParentChild} from "@engine/core/declarations";
import {TOGGLE_BUTTON_EVENTS} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvents";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";

export interface IChangeSelectBoxEvent {
    selectedIndex:number;
    target: SelectBox;
}

export class SelectBox extends VerticalListView {

    public readonly type:string = 'SelectBox';

    public readonly selectedBackground:RenderableModel;
    public readonly changeEventHandler:EventEmitterDelegate<TOGGLE_BUTTON_EVENTS, IChangeSelectBoxEvent> = new EventEmitterDelegate();

    private _options:(string|number)[] = [];
    private _textFields:TextField[] = [];
    private _selectedIndex:number = -1;

    private _tsxChanged:(e:IChangeSelectBoxEvent)=>void;

    private backgroundSelected: RenderableModel = new SimpleGameObjectContainer(this.game);
    private lastSelectedView:TextField;

    private readonly textColor:Color = Color.GREY.clone();

    private readonly defaultBackground:RenderableModel = new SimpleGameObjectContainer(this.game);

    constructor(protected game: Game, protected font: Font) {
        super(game);
        const bg = new Rectangle(this.game);
        bg.fillColor = Color.fromCssLiteral('#f3f3f3');
        this.selectedBackground = bg;
    }

    public setOptions(options:(string|number)[]):void {
        if (this._selectedIndex<0 || this._selectedIndex>options.length-1) this._selectedIndex = - 1;
        this.lastSelectedView = undefined!;
        this._options = options;
        this.empty();
        this._textFields.length = 0;
        this.revalidate();
        const clientRect = this.getClientRect();
        options.forEach((it,index)=>{
            const tf:TextField = new TextField(this.game,this.font);
            tf.size.setWH(clientRect.width,this.font.context.lineHeight);
            tf.setText(it);
            this._textFields.push(tf);
            const listViewItem:ListViewItem = new ListViewItem(tf);
            listViewItem.listViewEventHandler.on(LIST_VIEW_EVENTS.itemClick, ()=>{
                if (index===this._selectedIndex) return;
                this.select(index);
                this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed,{target:this,selectedIndex:index});
            });
            this.addView(listViewItem);
        });
        this.passPropertiesToChildren();
        this.select(this._selectedIndex);
        this.moveSelectedIntoViewRect();
    }

    public setTextColor(col:IColor):void {
        this.textColor.set(col);
        this.passPropertiesToChildren();
    }

    public getOptions():(number|string)[] {
        return this._options;
    }

    public setBackgroundSelected(background: RenderableModel):void {
        if (this.backgroundSelected === background) return;
        this.backgroundSelected = background;
        this.select(this._selectedIndex);
    }

    public setSelectedIndex(index:number):void {
        this.select(index);
        this.moveSelectedIntoViewRect();
        this._selectedIndex = index;
    }

    public getSelectedIndex():number {
        return this._selectedIndex;
    }

    public getSelectedValue():string|number {
        return this._options[this._selectedIndex];
    }

    public setProps(props:ISelectBoxProps):void {
        super.setProps(props);
        if (props.options!==undefined && this.getOptions()!==props.options) this.setOptions(props.options);
        if (props.textColor!==undefined) this.setTextColor(props.textColor);
        if (props.changed!==undefined && props.changed!==this._tsxChanged) {
            if (this._tsxChanged!==undefined) this.changeEventHandler.off(TOGGLE_BUTTON_EVENTS.changed,this._tsxChanged);
            this.changeEventHandler.on(TOGGLE_BUTTON_EVENTS.changed, props.changed);
            this._tsxChanged = props.changed;
        }
        if (props.backgroundSelected!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.backgroundSelected);
            if (memoized!==this.backgroundSelected) this.setBackgroundSelected(memoized);
        }
        if (props.selectedIndex!==undefined && props.selectedIndex!==this._selectedIndex) {
            this.setSelectedIndex(props.selectedIndex);
        }
    }

    protected onCleared():void {
        super.onCleared();
        this.fitChildSize(this.backgroundSelected);
    }

    private passPropertiesToChildren():void {
        this._textFields.forEach((tf,index)=>{
            tf.textColor.set(this.textColor);
        });
    }

    private select(index:number):void{
        if (index===-1) return;
        this._selectedIndex = index;
        const tf:TextField = this._textFields[index];
        if (tf===undefined) return;
        (this.defaultBackground as IParentChild).parent = undefined;
        if (this.lastSelectedView!==undefined) this.lastSelectedView.setBackground(this.defaultBackground);
        (this.backgroundSelected as IParentChild).parent = undefined;
        tf.setBackground(this.backgroundSelected);
        this.lastSelectedView = tf;
    }

    private moveSelectedIntoViewRect():void {
        const view:TextField = this.lastSelectedView;
        if (view===undefined) return;
        const newOffset:number = -view.size.height*this._selectedIndex;
        this._scrollContainerDelegate.setCurrentOffsetVertical(newOffset);
    }

}
