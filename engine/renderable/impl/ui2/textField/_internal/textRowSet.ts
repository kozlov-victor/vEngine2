import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {TextRow} from "@engine/renderable/impl/ui2/textField/_internal/textRow";
import {Word} from "@engine/renderable/impl/ui2/textField/_internal/word";

export class TextRowSet extends NullGameObject {

    public declare children: readonly TextRow[];
    public caret:number = 0;

    private currentTextRow:TextRow;
    private alignTextContentVertical:AlignTextContentVertical = AlignTextContentVertical.TOP;
    private alignTextContentHorizontal:AlignTextContentHorizontal = AlignTextContentHorizontal.LEFT;
    private alignText:AlignText = AlignText.LEFT;
    private wordBrake:WordBrake = WordBrake.FIT;
    private rawText:string;

    constructor(game:Game,private font:Font,private readonly constrainWidth:number,private readonly constrainHeight:number) {
        super(game);
    }

    private addWord(word:Word,applyNewLineIfCurrentIsFull:boolean):void {
        if (this.currentTextRow===undefined) {
            this.currentTextRow = new TextRow(this.game,this.font,this.constrainWidth,this);
            this.appendChild(this.currentTextRow);
        }
        if (applyNewLineIfCurrentIsFull && !this.currentTextRow.canAddWord(word)) {
            this.newRow();
        }
        this.currentTextRow.addWord(word,applyNewLineIfCurrentIsFull);
    }

    private newRow():void{
        this.currentTextRow.complete();
        this.caret+=this.currentTextRow.size.height;
        this.currentTextRow = new TextRow(this.game,this.font,this.constrainWidth,this);
        this.currentTextRow.pos.y = this.caret;
        this.appendChild(this.currentTextRow);
    }

    public setText(text:string,wordBrake:WordBrake){
        this.wordBrake = wordBrake;
        if (text===this.rawText) return;
        this.rawText = text;
        this.clear();
        if (wordBrake===WordBrake.PREDEFINED) {
            this.rawText.split('').forEach(word=>{ // treat each symbol as separate word
                switch (word) {
                    case '\r':
                        break;
                    case '\n':
                        this.newRow();
                        break;
                    case '\t':
                        this.addWord(new Word(this.game,this.font,'    '),false);
                        break;
                    default:
                        this.addWord(new Word(this.game,this.font,word),false);
                        break;
                }
            });
        } else {
            this.rawText.
                split(/[\t\n\s]/g).
                filter(it=>it.length>0).
                forEach(word=>{ // split to words and smart fit it
                    this.addWord(new Word(this.game,this.font,word),true);
                });
        }
        this.currentTextRow.complete();
        this.fitSize();
    }

    public setAlignTextContentHorizontal(align:AlignTextContentHorizontal):void {
        if (this.children.length===0) return;
        if (align===this.alignTextContentHorizontal) return;
        switch (align) {
            case AlignTextContentHorizontal.CENTER:
                let pos:number = (this.constrainWidth - this.size.width)/2;
                if (pos<0) pos = 0;
                this.pos.x = pos;
                break;
            case AlignTextContentHorizontal.LEFT:
                this.pos.setX(0);
                break;
            case AlignTextContentHorizontal.RIGHT:
                this.pos.setX(this.constrainWidth - this.size.width);
                break;
        }
        this.alignTextContentHorizontal = align;
    }

    public setAlignTextContentVertical(align:AlignTextContentVertical):void {
        if (this.children.length===0) return;
        if (align===this.alignTextContentVertical) return;
        switch (align) {
            case AlignTextContentVertical.CENTER:
                let pos:number = (this.constrainHeight - this.size.height)/2;
                if (pos<0) pos = 0;
                this.pos.y = pos;
                break;
            case AlignTextContentVertical.TOP:
                this.pos.setY(0);
                break;
            case AlignTextContentVertical.BOTTOM:
                console.log(this.constrainHeight,this.size.height);
                this.pos.setY(this.constrainHeight - this.size.height);
                break;
        }
    }

    public setAlignText(align:AlignText) {
        if (this.children.length===0) return;
        if (align===this.alignText) return;
        this.children.forEach(c=>c.setAlignText(align));
    }

    public updateRowsVisibility():void {
        this.children.forEach((c)=>{
            if ((c.pos.y + this.pos.y + c.size.height) <0) c.visible = false;
            else c.visible = (c.pos.y + this.pos.y) <= this.constrainHeight;
        });
    }

    public getWordBrake():WordBrake{
        return this.wordBrake;
    }


    private fitSize():void {
        this.fitWidth();
        this.fitHeight();
    }

    private fitWidth():void {
        this.size.width = Math.max(...this.children.map(it=>it.size.width),0);
    }

    private fitHeight():void{
        let height:number = 0;
        this.children.forEach(row=>height+=row.size.height);
        this.size.height = height;
    }

    private clear():void {
        if (this.children.length===0) return;
        this.removeChildren();
        this.caret = 0;
        this.currentTextRow = undefined!;
    }

}
