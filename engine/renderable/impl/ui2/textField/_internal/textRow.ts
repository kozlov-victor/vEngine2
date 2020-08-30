import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {AlignText, WordBrake} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Word} from "@engine/renderable/impl/ui2/textField/_internal/word";
import {TextRowSet} from "@engine/renderable/impl/ui2/textField/_internal/textRowSet";

export class TextRow extends NullGameObject {

    public declare children: readonly Word[];

    private caret:number = 0;
    private alignText:AlignText = AlignText.LEFT;

    constructor(game:Game,private font:Font,private constrainWidth:number,private readonly rowSet:TextRowSet) {
        super(game);
    }

    public canAddWord(word:Word):boolean{
        if (this.children.length===0) return true;
        return this.caret + this.rowSet.spaceChar.size.width + word.size.width<=this.constrainWidth;
    }

    public addWord(word:Word,addWhiteSpaceBeforeIfNeed:boolean):void {
        if (this.children.length!==0 && addWhiteSpaceBeforeIfNeed) this._addWord(this.rowSet.spaceChar.clone());
        this._addWord(word);
    }

    public complete():void {
        this.size.height = Math.max(...this.children.map(it=>it.size.height),this.rowSet.spaceChar.size.height);
    }

    public setAlignText(align:AlignText):void{
        if (this.children.length===0) return;
        if (align===this.alignText) return;
        if (this.rowSet.getWordBrake()===WordBrake.PREDEFINED) return;

        switch (align) {
            case AlignText.RIGHT:
                this.pos.setX(this.rowSet.size.width - this.size.width);
                break;
            case AlignText.CENTER:
                this.pos.setX((this.rowSet.size.width - this.size.width)/2);
                break;
            case AlignText.LEFT:
                this.pos.setX(0);
                break;
            case AlignText.JUSTIFY:
                const onlyWords:Word[] = this.children.filter(it=>it.rawValue!==' ');
                const onlyWordsWidth:number =
                    onlyWords.
                    map(it=>it.size.width).
                    reduce((it,prev)=>it+prev,0);
                let spaceWidth:number = (this.rowSet.size.width - onlyWordsWidth)/(onlyWords.length-1);
                if (spaceWidth>this.rowSet.spaceChar.size.width*2) spaceWidth = this.rowSet.spaceChar.size.width;
                this.removeChildren();
                this.caret = 0;

                onlyWords.forEach(w=>{
                    if (this.children.length!==0) {
                        this.caret+=spaceWidth;
                    }
                    this._addWord(w);
                });
                break;
        }

        this.alignText = align;

    }

    private _addWord(word:Word){
        word.pos.setX(this.caret);
        this.caret+=word.size.width;
        this.appendChild(word);
        this.size.width+=word.size.width;
        if (this.size.width>this.constrainWidth) this.size.width = this.constrainWidth;
    }

}
