import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Cursor} from "@engine/renderable/impl/ui/textField/editTextField/cursor";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {TextRow} from "@engine/renderable/impl/ui/textField/_internal/textRow";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {ICharacterInfo} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {NEWLINE_CHAR, TypeHelper} from "@engine/renderable/impl/ui/textField/editTextField/typeHelper";
import {Incrementer} from "@engine/resources/incrementer";
import {IRect} from "@engine/geometry/rect";
import {VirtualNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {IKeyboardFocusable} from "@engine/renderable/impl/ui/textField/_internal/iKeyboardFocusable";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {TOGGLE_BUTTON_EVENTS} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvents";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";

export interface IChangeEditTextFieldEvent {
    target: EditTextField;
    value: string;
}

export class EditTextField extends RichTextField implements IKeyboardFocusable{

    public override readonly type:string = 'EditTextField';

    public cursorColor:Color = Color.GREY.clone();
    public multiline:boolean = true;

    public readonly changeEventHandler:EventEmitterDelegate<TOGGLE_BUTTON_EVENTS, IChangeEditTextFieldEvent> = new EventEmitterDelegate(this.game);

    private cursor:Cursor;

    private _tsxChanged:(e:IChangeEditTextFieldEvent)=>void;

    constructor(game:Game,font:Font) {
        super(game,font);
        this.focusable = true;
        this.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
    }

    public override revalidate():void {
        super.revalidate();
        if (this.cursor===undefined) {
            this.cursor = new Cursor(this.game,this,this.font);
            this.cursor.start(this.rowSetContainer);
            this.scrollHandler.on('scroll', _=>{
                this.cursor.redrawCursorView();
            });
        }
    }

    override focus() {
        super.focus();
        if (!this.getText()) { // trigger cursor position recalculation
            this.setText(' ');
            this.setTimeout(()=>this.setText(''),1);
        }
    }

    public _requestFocusForTextRow(textRow:TextRow):void {
        const clientRect:Readonly<IRect> = this.getClientRect();
        if (this.rowSet.size.height<clientRect.height) return;

        let currentOffsetVertical:number = this.getCurrentOffsetVertical();
        if (textRow.pos.y + textRow.size.height - Math.abs(currentOffsetVertical) > clientRect.height) { // scroll to bottom if it needs
            currentOffsetVertical = -(textRow.pos.y + textRow.size.height - clientRect.height);
        } else if (textRow.pos.y - Math.abs(currentOffsetVertical) < 0) { // scroll to top if it needs
            currentOffsetVertical = - textRow.pos.y;
        }
        this.setCurrentOffsetVertical(currentOffsetVertical);
    }

    public _triggerChange():void {
        this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {target:this,value:this.getText()});
    }

    public override setProps(props: IEditTextFieldProps,parent:IRealNode):void {
        super.setProps(props,parent);
        if (props.changed!==undefined && props.changed!==this._tsxChanged) {
            if (this._tsxChanged!==undefined) this.changeEventHandler.off(TOGGLE_BUTTON_EVENTS.changed,this._tsxChanged);
            this.changeEventHandler.on(TOGGLE_BUTTON_EVENTS.changed, props.changed);
            this._tsxChanged = props.changed;
        }
        if (props.text!==undefined) this.setText(props.text);
        if (props.cursorColor!==undefined) {
            const r = props.cursorColor.r;
            const g = props.cursorColor.g;
            const b = props.cursorColor.b;
            const a = props.cursorColor.a ?? 255;
            const dirty:boolean =
                r!==this.cursorColor.r ||
                g!==this.cursorColor.g ||
                b!==this.cursorColor.b ||
                a!==this.cursorColor.a;
            if (dirty) {
                this.cursorColor.setFrom(props.cursorColor);
                this.markAsDirty();
            }
        }
        if (props.multiline!==undefined) this.multiline = props.multiline;
    }

    protected override onClientRectChanged():void {
        if (this.cursor!==undefined) this.cursor.onClientRectChanged(this.getClientRect());
    }

    protected override _applyText():void {
        const newLines:ICharacterInfo[] = [];
        this._textEx.getAllChars().forEach(c=>{
            if (c.rawChar===NEWLINE_CHAR) newLines.push(c);
            c.uuid??=Incrementer.getValue();
        });
        super._applyText();
        for (let i:number = 0; i < this.rowSet._children.length; i++) {
            const row:TextRow = this.rowSet._children[i];
            const newline:ICharacterInfo =
                newLines[i] ||
                {
                    rawChar:'\n',
                    multibyte:false,
                    scaleFromCurrFontSize:1,
                };
            if (this.rowSet._children.indexOf(row)===this.rowSet._children.length-1) {
                newline.uuid = TypeHelper.LAST_NEWLINE_ID;
            } else {
                newline.uuid??= Incrementer.getValue();
            }
            const newLineWord:Word = new Word(this.game,this.font,[newline],Color.NONE.clone(),false);
            row.addWord(newLineWord,false);
        }
        if (this.cursor!==undefined) this.cursor.clearDirtyTyped();
    }

    public override setText(text: string | number):void {
        if (this.getText()===text) return;
        super.setText(text);
        if (this.cursor!==undefined) this.cursor.currentRow = undefined;
    }

    public override setRichText(node: VirtualNode|JSX.Element):void {
        super.setRichText(node);
        if (this.cursor!==undefined) this.cursor.currentRow = undefined;
    }

    public _getRowSet():TextRowSet {
        return this.rowSet;
    }

}
