import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {
    VerticalList
} from "@engine/renderable/impl/ui/scrollViews/directional/verticalList";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {IParentChild} from "@engine/core/declarations";
import {TOGGLE_BUTTON_EVENTS} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvents";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";
import {LIST_VIEW_EVENTS} from "@engine/renderable/impl/ui/scrollViews/directional/directionalListEvents";
import {IChangeSelectBoxEvent} from "@engine/renderable/impl/ui/selectBox/selectBoxEvents";


export class SelectBox extends VerticalList {

    public override readonly type:string = 'SelectBox';

    public readonly selectedBackground:RenderableModel;
    public readonly changeEventHandler:EventEmitterDelegate<TOGGLE_BUTTON_EVENTS, IChangeSelectBoxEvent> = new EventEmitterDelegate();

    private _options:(string|number)[] = [];
    private _optionViews:WidgetContainer[] = [];
    private _selectedIndex:number = -1;

    private _tsxChanged:(e:IChangeSelectBoxEvent)=>void;

    private backgroundSelected: RenderableModel = new SimpleGameObjectContainer(this.game);
    private lastSelectedView:WidgetContainer;

    private readonly textColor:Color = Color.GREY.clone();

    private readonly defaultBackground:RenderableModel = new SimpleGameObjectContainer(this.game);
    private isCustomRenderer:boolean = false;

    constructor(game: Game, protected font: Font) {
        super(game);
        const bg = new Rectangle(this.game);
        bg.fillColor = Color.fromCssLiteral('#f3f3f3');
        this.selectedBackground = bg;
        this.listViewEventHandler.on(LIST_VIEW_EVENTS.itemClick, e=>{
            if (e.dataIndex===this._selectedIndex) return;
            this.select(e.dataIndex);
            this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed,{target:this,selectedIndex:e.dataIndex});
        });
    }

    public setOptions(options:(string|number|any)[],renderItem?:(dataItem:any)=>WidgetContainer):void {
        if (this._selectedIndex<0 || this._selectedIndex>options.length-1) this._selectedIndex = - 1;
        this.lastSelectedView = undefined!;
        this._options = options;
        this.empty();
        this._optionViews.length = 0;
        this.revalidate();
        const clientRect = this.getClientRect();
        this.isCustomRenderer = renderItem!==undefined;
        options.forEach((it,index)=>{
            if (renderItem===undefined) {
                const tf:TextField = new TextField(this.game,this.font);
                tf.size.setWH(clientRect.width,this.font.context.lineHeight);
                tf.setText(it);
                this._optionViews.push(tf);
                this.addView(tf);
            } else {
                const child:WidgetContainer = renderItem(it);
                this.addView(child);
                this._optionViews.push(child);
            }
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

    public override setProps(props:ISelectBoxProps<any>):void {
        super.setProps(props);
        if (props.data!==undefined && this.getOptions()!==props.data) {
            const renderItemFn =
                props.renderItem===undefined?undefined:
                (item:any):WidgetContainer=> {
                    const node:VirtualNode = props.renderItem!(item) as VirtualNode;
                    const VEngineElementCreator =
                        require('@engine/renderable/tsx/vEngine/vEngineElementCreator').VEngineElementCreator;
                    const model:WidgetContainer =
                        VEngineElementCreator.getCreatedInstance().createElementByTagName(node) as WidgetContainer;
                    VEngineElementCreator.getCreatedInstance().setProps(model,node);
                    return model;
                };
            this.setOptions(
                props.data,
                renderItemFn
            );
        }
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

    protected override onCleared():void {
        super.onCleared();
        this.fitChildSize(this.backgroundSelected);
    }

    private passPropertiesToChildren():void {
        if (this.isCustomRenderer) return;
        this._optionViews.forEach((c,index)=>{
            (c as TextField).textColor.set(this.textColor);
        });
    }

    private select(index:number):void{
        if (index===-1) return;
        this._selectedIndex = index;
        const optionContainer:WidgetContainer = this._optionViews[index];
        if (optionContainer===undefined) return;
        (this.defaultBackground as IParentChild).parent = undefined;
        if (this.lastSelectedView!==undefined) this.lastSelectedView.setBackground(this.defaultBackground);
        (this.backgroundSelected as IParentChild).parent = undefined;
        optionContainer.setBackground(this.backgroundSelected);
        this.lastSelectedView = optionContainer;
    }

    private moveSelectedIntoViewRect():void {
        const view:WidgetContainer = this.lastSelectedView;
        if (view===undefined) return;
        const newOffset:number = -view.size.height*this._selectedIndex;
        this._scrollContainerDelegate.setCurrentOffsetVertical(newOffset);
    }

}
