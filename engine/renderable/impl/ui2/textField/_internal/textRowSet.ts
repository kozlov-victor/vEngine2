import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical
} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {TextRow} from "@engine/renderable/impl/ui2/textField/_internal/textRow";
import {Word} from "@engine/renderable/impl/ui2/textField/_internal/word";

export class TextRowSet extends NullGameObject {

    public declare children: readonly TextRow[];
    public caret:number = 0;

    private currentTextRow:TextRow = new TextRow(this.game,this.font,this.constrainWidth,this);
    private alignTextContentVertical:AlignTextContentVertical = AlignTextContentVertical.TOP;
    private alignTextContentHorizontal:AlignTextContentHorizontal = AlignTextContentHorizontal.LEFT;
    private alignText:AlignText = AlignText.LEFT;

    constructor(game:Game,private font:Font,private readonly constrainWidth:number,private readonly constrainHeight:number) {
        super(game);
        this.appendChild(this.currentTextRow);
    }

    private addWord(word:Word):void {
        if (!this.currentTextRow.canAddWord(word)) {
            this.currentTextRow.complete();
            this.caret+=this.currentTextRow.size.height;
            this.currentTextRow = new TextRow(this.game,this.font,this.constrainWidth,this);
            this.currentTextRow.pos.y = this.caret;
            this.appendChild(this.currentTextRow);
        }
        this.currentTextRow.addWord(word);
    }

    public setText(text:string){
        text.split(' ').filter(it=>it.length>0).forEach(word=>{
            const w:Word = new Word(this.game,this.font,word);
            this.addWord(w);
        });
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

    private fitSize():void {
        this.fitWidth();
        this.fitHeight();
    }

    private fitWidth():void {
        this.size.width = Math.max(...this.children.map(it=>it.size.width));
    }

    private fitHeight():void{
        let height:number = 0;
        this.children.forEach(row=>height+=row.size.height);
        this.size.height = height;
    }

}
