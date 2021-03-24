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
import {ICharacterInfo} from "@engine/renderable/impl/ui/textField/_internal/stringEx";


export class EditTextField extends RichTextField {

    public readonly cursorColor:Color = Color.GREY.clone();

    private cursor:Cursor;

    constructor(game:Game,font:Font) {
        super(game,font);
        this.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
    }

    public revalidate():void {
        super.revalidate();
        if (this.cursor===undefined) {
            this.cursor = new Cursor(this.game,this,this.font);
            this.cursor.start(this.rowSetContainer);
            this.on(MOUSE_EVENTS.scroll, _=>{
                this.cursor.redrawCursorView();
            });
        }
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

    protected onClientRectChanged():void {
        if (this.cursor!==undefined) this.cursor.onClientRectChanged(this.getClientRect());
    }

    protected _setText():void {
        super._setText();
        for (const row of this.rowSet.children) {
            const newline:ICharacterInfo =
                {
                    rawChar:'\n',
                    multibyte:false,
                    scaleFromCurrFontSize:1,
                    uuid: `new_line_${this.rowSet.children.indexOf(row)}`
                };
            const newLineWord:Word = new Word(this.game,this.font,[newline],Color.NONE.clone(),false);
            row.addWord(newLineWord,false);
        }
        if (this.cursor!==undefined) this.cursor.clearDirtyTyped();
    }

    public _getRowSet():TextRowSet {
        return this.rowSet;
    }

}
