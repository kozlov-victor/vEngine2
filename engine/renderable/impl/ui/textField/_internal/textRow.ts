import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {AlignText} from "@engine/renderable/impl/ui/textField/textAlign";
import {Color} from "@engine/renderer/common/color";

export class TextRow extends NullGameObject {

    public declare children: readonly Word[];

    private caret:number = 0;
    private alignText:AlignText = AlignText.LEFT;
    public readonly DEFAULT_SPACE_CHAR_WIDTH:number =
        new Word(this.game,this.font,[{rawChar:' ',isEmoji:false,scaleFromCurrFontSize:1}],Color.NONE).size.width;

    constructor(game:Game,private font:Font,private constrainWidth:number,private readonly rowSet:TextRowSet) {
        super(game);
    }

    public canAddWord(word:Word):boolean{
        if (this.children.length===0) return true;
        const currentSpaceSize:number = this.getMaxCharacterFontScale() * this.DEFAULT_SPACE_CHAR_WIDTH;
        return this.caret + currentSpaceSize + word.size.width<=this.constrainWidth;
    }

    public addWord(word:Word,addWhiteSpaceBeforeIfNeed:boolean):void {
        if (this.children.length!==0 && addWhiteSpaceBeforeIfNeed) {
            const scaleFromCurrFontSize =
                word.children[word.children.length-1]?.getCharacterInfo()?.scaleFromCurrFontSize
                ?? this.font.fontContext.lineHeight;
            const space:Word = new Word(this.game,this.font,[{rawChar:' ',isEmoji:false,scaleFromCurrFontSize}],Color.NONE);
            this._addWord(space);
        }
        this._addWord(word);
    }

    public complete():void {
        this.size.height =
            Math.max(
            ...this.children.map(it=>it.size.height),
                //this.font.fontContext.lineHeight
            )
            + this.font.fontContext.spacing[1];
    }

    public updateWordsVisibility():void{
        for (let i:number = 0; i < this.children.length; i++) {
            const c:Word = this.children[i];
            if ((c.pos.x + this.rowSet.pos.x + c.size.width) <0) c.visible = false;
            else {
                c.visible = (c.pos.x + this.rowSet.pos.x) <= this.constrainWidth;
            }
        }
    }

    public getMaxCharacterFontScale(): number {
        return Math.max(...this.children.map(it=>it.getMaxCharacterFontScale()));
    }

    public setAlignText(align:AlignText):void{
        if (this.children.length===0) return;
        if (align===this.alignText) return;

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
                const spaceCharWidth:number = this.getMaxCharacterFontScale()*this.DEFAULT_SPACE_CHAR_WIDTH;
                let spaceWidth:number = (this.rowSet.size.width - onlyWordsWidth)/(onlyWords.length-1);
                if (spaceWidth>spaceCharWidth*2) spaceWidth = spaceCharWidth;
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
        this.caret+=word.size.width+this.font.fontContext.spacing[0];
        this.appendChild(word);
        this.size.width+=word.size.width+this.font.fontContext.spacing[0];
        //if (this.size.width>this.constrainWidth) this.size.width = this.constrainWidth;
    }

}
