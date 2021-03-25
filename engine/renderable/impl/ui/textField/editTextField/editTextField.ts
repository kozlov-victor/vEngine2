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
import {NEWLINE_CHAR} from "@engine/renderable/impl/ui/textField/editTextField/typeHelper";
import {Incrementer} from "@engine/resources/incrementer";


export class EditTextField extends RichTextField {

    public readonly cursorColor:Color = Color.GREY.clone();

    private readonly LAST_NEWLINE_ID:number = Incrementer.getValue();
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
        const newLines:ICharacterInfo[] = [];
        this._textEx.getAllChars().forEach(c=>{
            if (c.rawChar===NEWLINE_CHAR) newLines.push(c);
            c.uuid??=Incrementer.getValue();
        });
        super._setText();
        for (let i:number = 0; i < this.rowSet.children.length; i++) {
            const row:TextRow = this.rowSet.children[i];
            const newline:ICharacterInfo =
                newLines[i] ||
                {
                    rawChar:'\n',
                    multibyte:false,
                    scaleFromCurrFontSize:1,
                };
            if (this.rowSet.children.indexOf(row)===this.rowSet.children.length-1) {
                newline.uuid = this.LAST_NEWLINE_ID;
            } else {
                newline.uuid??= Incrementer.getValue();
            }
            const newLineWord:Word = new Word(this.game,this.font,[newline],Color.NONE.clone(),false);
            row.addWord(newLineWord,false);
        }
        if (this.cursor!==undefined) this.cursor.clearDirtyTyped();
    }

    public _getRowSet():TextRowSet {
        return this.rowSet;
    }

}
