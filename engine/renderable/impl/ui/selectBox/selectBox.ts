import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Container} from "@engine/renderable/impl/ui/container";
import {ScrollContainerDelegate} from "@engine/renderable/impl/ui/scrollBar/scrollContainerDelegate";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {NoOverflowSurface} from "@engine/renderable/impl/surface/noOverflowSurface";
import {IRectJSON} from "@engine/geometry/rect";

// todo
export class SelectBox extends Container {

    private _options:(string|number)[] = [];
    private _selected:string|number;

    public readonly selectedColor:Color = Color.WHITE.clone();

    private readonly _constrainContainer: RenderableModel;
    private readonly _scrollableContainer: RenderableModel;
    private _scrollContainerDelegate:ScrollContainerDelegate;

    constructor(protected game: Game, protected font: Font) {
        super(game);
        this.size.setWH(160,60);

        this._constrainContainer = new NoOverflowSurface(this.game,this.size);
        this._constrainContainer.size.set(this.size);
        this.appendChild(this._constrainContainer);

        this._scrollableContainer = new NullGameObject(this.game);
        this._scrollableContainer.size.setWH(this.size.width,400);
        this._constrainContainer.appendChild(this._scrollableContainer);

        const rect = new Rectangle(this.game);
        rect.pos.setXY(100,100);
        this._scrollableContainer.appendChild(rect);
        console.log(this._scrollableContainer.id);
        rect.on(MOUSE_EVENTS.click, e=>{
            console.log('clicked',e);
        });
    }

    public setOptions(options:(string|number)[]):void {
        this._options = options;
        this.markAsDirty();
    }

    public setSelected(val:string|number):void {
        this._selected = val;
        this.markAsDirty();
    }

    public setSelectedIndex(index:number):void {
        this._selected = this._options[index];
        this.markAsDirty();
    }

    public getSelected<T extends string|number>():T {
        return this._selected as T;
    }

    public revalidate():void {
        super.revalidate();
        const clientRect:Readonly<IRectJSON> = this.getClientRect();
        this._constrainContainer.pos.set(clientRect);
        this._constrainContainer.size.set(clientRect);
        if (this._constrainContainer.size.isZero()) this._constrainContainer.size.set(this.size);
        if (this._scrollContainerDelegate===undefined) {
            this._scrollContainerDelegate = new ScrollContainerDelegate(this.game,this,this._constrainContainer,this._scrollableContainer);
        }
        this._scrollContainerDelegate.revalidate();

        // const clientRect = this.getClientRect();
        // const selectedIndex:number = this._options.indexOf(this._selected);
        // if (selectedIndex===-1) {
        //     this._selected = undefined!;
        //     return;
        // }
        // const textRow:TextRow = this._textField.findRowByIndex(selectedIndex);
        // console.log({textRow});
        // if (textRow===undefined) return;
    }


    public update():void {
        super.update();
        this._scrollContainerDelegate.update();
    }

}
