import {SimpleGameObjectContainer} from "../../../general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {AlignText} from "@engine/renderable/impl/ui/textField/textAlign";
import {Color} from "@engine/renderer/common/color";

export class TextRow extends SimpleGameObjectContainer {

    public declare _children:Word[];

    private caret:number = 0;
    private alignText:AlignText = AlignText.LEFT;

    constructor(game:Game,private font:Font,private constrainWidth:number,private readonly rowSet:TextRowSet) {
        super(game);
    }

    public canAddWord(word:Word):boolean{
        if (this._children.length===0) return true;
        const currentSpaceWidth:number = word.getMaxCharacterFontScale() * this.rowSet.DEFAULT_SPACE_CHAR_WIDTH;
        return this.caret + currentSpaceWidth + word.size.width<=this.constrainWidth;
    }

    public addWord(word:Word,addWhiteSpaceBeforeIfNeed:boolean):void {
        if (this._children.length!==0 && addWhiteSpaceBeforeIfNeed) {
            const scaleFromCurrFontSize:number = word.getMaxCharacterFontScale();
            const space:Word =
                new Word(this.game,this.font,[{rawChar:' ',multibyte:false,scaleFromCurrFontSize}],Color.NONE,this.rowSet.isPixelPerfect());
            this._addWord(space);
        }
        this._addWord(word);
    }

    public complete():void {
        if (this._children.length===0) {
            this.size.height = this.font.context.lineHeight;
        } else {
            this.size.height =
                Math.max(...this._children.map(it=>it.getMaxCharacterLineHeight()));
        }
        // + this.font.context.spacing[1]; hierro fnt already goes with precalculated lineHeight
    }

    public updateWordsVisibility():void{
        for (let i:number = 0; i < this._children.length; i++) {
            const c:Word = this._children[i];
            if ((c.pos.x + this.rowSet.pos.x + c.size.width) <0) c.visible = false;
            else {
                c.visible = (c.pos.x + this.rowSet.pos.x) <= this.constrainWidth;
            }
        }
    }

    public getMaxCharacterFontScale(): number {
        return Math.max(...this._children.map(it=>it.getMaxCharacterFontScale())) ?? 1;
    }

    public setAlignText(align:AlignText):void{
        if (this._children.length===0) return;
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
                const onlyWords:Word[] = this._children.filter(it=>it.rawValue!==' ');
                const onlyWordsWidth:number =
                    onlyWords.
                    map(it=>it.size.width).
                    reduce((it,prev)=>it+prev,0);
                const spaceCharWidth:number = this.getMaxCharacterFontScale()*this.rowSet.DEFAULT_SPACE_CHAR_WIDTH;
                let spaceWidth:number = (this.rowSet.size.width - onlyWordsWidth)/(onlyWords.length-1);
                if (spaceWidth>spaceCharWidth*2) spaceWidth = spaceCharWidth;
                this.removeChildren();
                this.caret = 0;

                onlyWords.forEach(w=>{
                    if (this._children.length!==0) {
                        this.caret+=spaceWidth;
                    }
                    this._addWord(w);
                });
                break;
        }

        this.alignText = align;

    }

    private _addWord(word:Word):void{
        word.pos.setX(this.caret);
        this.caret+=word.size.width;
        this.appendChild(word);
        this.size.width+=word.size.width;
    }

}
