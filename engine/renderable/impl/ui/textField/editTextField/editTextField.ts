import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Cursor} from "@engine/renderable/impl/ui/textField/editTextField/cursor";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {TextRow} from "@engine/renderable/impl/ui/textField/_internal/textRow";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";


export class EditTextField extends RichTextField {

    public readonly cursorColor:Color = Color.GREY.clone();

    private readonly cursor:Cursor;

    constructor(game:Game,font:Font) {
        super(game,font);
        this.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
        this.cursor = new Cursor(this.game,this,font);
        this.on(MOUSE_EVENTS.scroll, _=>{
            this.cursor.redrawCursorView();
        });
    }

    public revalidate():void {
        super.revalidate();
        this.cursor.start(this.rowSetContainer);
    }

    public _scrollToTextRow(textRow:TextRow,delta:1|-1):void {
        let offset:number;
        const clientRect = this.getClientRect();
        if (delta===1) {
            offset =  textRow.pos.y - clientRect.height + textRow.size.height;
            offset = -offset;
        } else {
            offset = textRow.pos.y;
            offset = -offset;
        }
        this.setCurrentOffsetVertical(offset);
    }

    protected onCleared():void {
        super.onCleared();
        this.cursor.resizeDrawingView(this.getClientRect());
    }

    protected _setText():void {
        super._setText();
        for (const row of this.rowSet.children) {
            const newLineWord = new Word(this.game,this.font,[{rawChar:'\n',multibyte:false,scaleFromCurrFontSize:1}],Color.NONE.clone(),false);
            row.addWord(newLineWord,false);
        }
        this.cursor.clearDirtyTyped();
    }

    public _getRowSet():TextRowSet {
        return this.rowSet;
    }

}
