import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Cursor} from "@engine/renderable/impl/ui/textField/editTextField/cursor";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


export class EditTextField extends RichTextField {

    public readonly cursorColor:Color = Color.GREY.clone();

    private readonly cursor:Cursor;

    constructor(game:Game,font:Font) {
        super(game,font);
        this.cursor = new Cursor(this.game,this,font);
        (window as any).e = this;
        this.on(MOUSE_EVENTS.scroll, _=>{
            this.cursor.redrawCursorView();
        });
    }

    public revalidate():void {
        super.revalidate();
        this.cursor.start(this.rowSet,this.rowSetContainer);
    }

    protected onCleared():void {
        super.onCleared();
        this.cursor.resizeDrawingView(this.getClientRect());
    }

}
