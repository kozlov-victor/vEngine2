import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Cursor} from "@engine/renderable/impl/ui/textField/editTextField/cursor";


export class EditTextField extends RichTextField {

    public readonly cursorColor:Color = Color.GREY.clone();

    private readonly cursor:Cursor;

    constructor(game:Game,font:Font) {
        super(game,font);
        this.cursor = new Cursor(this.game,this,font);
        (window as any).e = this;
    }

    public revalidate():void {
        super.revalidate();
        this.cursor.start(this.rowSet,this.cacheSurface);
    }

    protected beforeTextRedraw():void {
        this.cursor.updateCursorView();
    }

    public __requestTextRedraw():void {
        super.requestTextRedraw();
    }


}
