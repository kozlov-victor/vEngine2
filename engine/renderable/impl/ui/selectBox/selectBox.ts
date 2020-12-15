import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {
    LIST_VIEW_EVENTS,
    ListViewItem,
    VerticalListView
} from "@engine/renderable/impl/ui/scrollViews/verticalListView";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";


export class SelectBox extends VerticalListView {

    public readonly selectedBackground:RenderableModel;

    private _options:(string|number)[] = [];
    private _textFields:TextField[] = [];
    private _selectedIndex:number = -1;

    private backgroundSelected: RenderableModel = new NullGameObject(this.game);
    private lastSelectedView:TextField;

    private textColor:Color = Color.BLACK.clone();

    private readonly defaultBackground:RenderableModel = new NullGameObject(this.game);


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
            tf.size.setWH(clientRect.width,this.font.fontContext.lineHeight);
            tf.setText(it);
            this._textFields.push(tf);
            const listViewItem:ListViewItem = new ListViewItem(tf);
            listViewItem.on(LIST_VIEW_EVENTS.itemClick, ()=>{
                this.select(index);
            });
            this.addView(listViewItem);
        });
        this.passPropertiesToChildren();
        this.select(this._selectedIndex);
        this.moveSelectedIntoViewRect();
    }

    setBackgroundSelected(background: RenderableModel):void {
        this.backgroundSelected = background;
        this.select(this._selectedIndex);
    }

    public setSelectedIndex(index:number):void {
        this.select(index);
        this.moveSelectedIntoViewRect();
    }

    public getSelectedIndex():number {
        return this._selectedIndex;
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
        if (this.lastSelectedView!==undefined) this.lastSelectedView.setBackground(this.defaultBackground);
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
