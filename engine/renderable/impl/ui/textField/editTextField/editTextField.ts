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
import {NEWLINE_CHAR, TypeHelper} from "@engine/renderable/impl/ui/textField/editTextField/typeHelper";
import {Incrementer} from "@engine/resources/incrementer";
import {IRect} from "@engine/geometry/rect";


export class EditTextField extends RichTextField {

    public cursorColor:Color = Color.GREY.clone();

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

    public _requestFocusForTextRow(textRow:TextRow):void {
        let currentOffsetVertical:number = this.getCurrentOffsetVertical();
        const clientRect:Readonly<IRect> = this.getClientRect();
        if (textRow.pos.y + textRow.size.height - Math.abs(currentOffsetVertical) > clientRect.height) { // scroll to bottom if it needs
            currentOffsetVertical = -(textRow.pos.y + textRow.size.height - clientRect.height);
        } else if (textRow.pos.y - Math.abs(currentOffsetVertical) < 0) { // scroll to top if it needs
            currentOffsetVertical = - textRow.pos.y;
        }
        this.setCurrentOffsetVertical(currentOffsetVertical);
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
                newline.uuid = TypeHelper.LAST_NEWLINE_ID;
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
