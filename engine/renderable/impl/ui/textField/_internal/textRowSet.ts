import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {TextRow} from "@engine/renderable/impl/ui/textField/_internal/textRow";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {Color} from "@engine/renderer/common/color";
import {ISize} from "@engine/geometry/size";
import {ICharacterInfo, StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {DebugError} from "@engine/debug/debugError";

export class TextRowSet extends NullGameObject {

    public declare children: readonly TextRow[];

    public readonly DEFAULT_SPACE_CHAR_WIDTH:number =
        new Word(this.game,this.font,[{rawChar:' ',multibyte:false,scaleFromCurrFontSize:1}],Color.NONE,false).size.width;

    private caret:number = 0;
    private currentTextRow:TextRow;
    private alignTextContentVertical:AlignTextContentVertical;
    private alignTextContentHorizontal:AlignTextContentHorizontal;
    private alignText:AlignText;
    private wordBrake:WordBrake;
    private pixelPerfect:boolean;

    constructor(
        game:Game,
        private font:Font,
        private readonly constrainSize:Readonly<ISize>,
        private readonly color:Color,
    ) {
        super(game);
    }

    private addWord(word:Word,applyNewLineIfCurrentIsFull:boolean,addWhiteSpaceBeforeIfNeed:boolean):void {
        if (this.currentTextRow===undefined) {
            this.currentTextRow = new TextRow(this.game,this.font,this.constrainSize.width,this);
            this.appendChild(this.currentTextRow);
        }
        if (applyNewLineIfCurrentIsFull && !this.currentTextRow.canAddWord(word)) {
            this.newRow();
        }
        this.currentTextRow.addWord(word,addWhiteSpaceBeforeIfNeed);
    }

    private newRow():void{
        if (this.currentTextRow===undefined) {
            this.currentTextRow = new TextRow(this.game,this.font,this.constrainSize.width,this);
            this.appendChild(this.currentTextRow);
        }
        this.currentTextRow.complete();
        this.caret+=this.currentTextRow.size.height;
        this.currentTextRow = new TextRow(this.game,this.font,this.constrainSize.width,this);
        this.currentTextRow.pos.y = this.caret;
        this.appendChild(this.currentTextRow);
    }

    public setFont(font:Font):void {
        this.font = font;
    }

    public setWordBrake(wordBrake:WordBrake):void{
        this.wordBrake = wordBrake;
    }

    public setPixelPerfect(value:boolean):void {
        this.pixelPerfect = value;
    }

    public isPixelPerfect():boolean {
        return this.pixelPerfect;
    }

    public setAlignTextContentHorizontal(align:AlignTextContentHorizontal):void {
        if (this.children.length===0) return;
        switch (align) {
            case AlignTextContentHorizontal.CENTER:
                let pos:number = (this.constrainSize.width - this.size.width)/2;
                if (pos<0) pos = 0;
                this.pos.x = pos;
                break;
            case AlignTextContentHorizontal.LEFT:
                this.pos.setX(0);
                break;
            case AlignTextContentHorizontal.RIGHT:
                this.pos.setX(this.constrainSize.width - this.size.width);
                break;
        }
        this.alignTextContentHorizontal = align;
    }

    public setAlignTextContentVertical(align:AlignTextContentVertical):void {
        if (this.children.length===0) return;
        switch (align) {
            case AlignTextContentVertical.CENTER:
                let pos:number = (this.constrainSize.height - this.size.height)/2;
                if (pos<0) pos = 0;
                this.pos.y = pos;
                break;
            case AlignTextContentVertical.TOP:
                this.pos.setY(0);
                break;
            case AlignTextContentVertical.BOTTOM:
                this.pos.setY(this.constrainSize.height - this.size.height);
                break;
        }
        this.alignTextContentVertical = align;
    }

    public setAlignText(align:AlignText):void {
        if (this.children.length===0) return;
        if (align===this.alignText) return;
        this.children.forEach(c=>c.setAlignText(align));
    }

    public updateRowsVisibility():void {
        for (let i:number=0,max:number=this.children.length;i<max;i++) {
            const c:TextRow = this.children[i];
            if ((c.pos.y + this.pos.y + c.size.height) <0) c.visible = false;
            else {
                c.visible = (c.pos.y + this.pos.y) <= this.constrainSize.height;
                if (c.visible) c.updateWordsVisibility();
            }
        }
    }

    public getWordBrake():WordBrake{
        return this.wordBrake;
    }

    public setText(stringEx:StringEx):void{
        this.clear();
        switch (this.wordBrake) {
            case WordBrake.PREDEFINED_BREAK_LONG_WORDS:
            case WordBrake.PREDEFINED: {
                const applyNewLineIfCurrentIsFull:boolean = this.wordBrake===WordBrake.PREDEFINED_BREAK_LONG_WORDS;
                stringEx.split(['\t','\n','\r',' '],true).forEach(s=>{
                    switch (s.getAllChars()[0].rawChar) {
                        case '\r':
                            break;
                        case '\n':
                            this.newRow();
                            break;
                        case ' ':
                            this.addWord(new Word(this.game,this.font,s.getAllChars(),this.color,this.pixelPerfect),applyNewLineIfCurrentIsFull,false);
                            break;
                        case '\t':
                            const char:ICharacterInfo = s.getAllChars()[0];
                            char.rawChar = ' ';
                            this.addWord(new Word(this.game,this.font,[char,char,char,char],this.color,this.pixelPerfect),applyNewLineIfCurrentIsFull,false);
                            break;
                        default:
                            this.addWord(new Word(this.game,this.font,s.getAllChars(),this.color,this.pixelPerfect),applyNewLineIfCurrentIsFull,false);
                            break;
                    }
                });
                break;
            }
            case WordBrake.FIT: {
                stringEx.
                split(['\t','\n','\r',' '],false).filter(it=>it.asRaw().trim().length).
                forEach(s=>{
                    this.addWord(new Word(this.game,this.font,s.getAllChars(),this.color,this.pixelPerfect),true,true);
                });
                break;
            }
            default: {
                if (DEBUG) throw new DebugError(`unknown wordBrake value: ${this.wordBrake}`);
            }
        }
        if (this.currentTextRow!==undefined) this.currentTextRow.complete();
        this.fitSize();
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
        this.removeChildren();
        this.caret = 0;
        this.currentTextRow = undefined!;
    }

}
