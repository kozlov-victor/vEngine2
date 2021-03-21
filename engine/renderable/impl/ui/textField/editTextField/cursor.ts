import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {Timer} from "@engine/misc/timer";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {TextRow} from "@engine/renderable/impl/ui/textField/_internal/textRow";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {ICharacterInfo, StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Optional} from "@engine/core/declarations";
import {Font} from "@engine/renderable/impl/general/font/font";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IRect} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";


export class Cursor {

    private currentRow:Optional<TextRow>;
    private currentWord:Optional<Word>;
    private currentCharInfo:Optional<Readonly<ICharacterInfo>>;
    private currentCharImage:Optional<CharacterImage>;

    private visible:boolean = false;
    private blinkTimer:Timer;
    private blinkInterval:number = 1000;

    private rowSetContainer:RenderableModel;
    private cacheSurface:DrawingSurface;
    private cursorView:Rectangle = new Rectangle(this.game);
    private dirtyChar:Optional<ICharacterInfo>;
    private dirtyRowIndex:Optional<number>;

    constructor(private game:Game,private parent:EditTextField,private font:Font) {
        this.cursorView.visible = false;
        this.cursorView.lineWidth = 0;
        this.listenToMouse();
    }

    private static isRowTotallyInView(textField:ScrollableTextField, textRow:TextRow, viewHeight:number):boolean  {
        const relativePosY:number = textRow.pos.y+textField.getCurrentOffsetVertical();
        if (relativePosY<0) return false;
        else return relativePosY + textRow.size.height <= viewHeight;
    }

    public start(rowSetContainer:RenderableModel):void {
        this.rowSetContainer = rowSetContainer;
        if (this.blinkTimer===undefined) this.startBlinkTimer();
    }

    public resizeDrawingView(rect:Readonly<IRect>):void{
        if (this.cacheSurface!==undefined) {
            this.cacheSurface.removeSelf();
            this.cacheSurface.destroy();
        }
        this.cacheSurface = new DrawingSurface(this.game,rect);
        this.cacheSurface.pos.set(rect);
        this.parent.appendChildBefore(this.rowSetContainer,this.cacheSurface);
    }

    private listenToMouse():void {

        const listener = (e:IKeyBoardEvent)=>{
            switch (e.key) {
                case KEYBOARD_KEY.RIGHT:
                    this.moveToNextPosition(1);
                    break;
                case KEYBOARD_KEY.LEFT:
                    this.moveToNextPosition(-1);
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.moveToNextRow(1);
                    break;
                case KEYBOARD_KEY.UP:
                    this.moveToNextRow(-1);
                    break;
                default:
                    this.typeSymbol(e);
                    break;
            }
        };
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyPressed, e=>listener(e));
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyRepeated, e=>listener(e));
    }

    private typeSymbol(e:IKeyBoardEvent):void {
        if ((e.nativeEvent as KeyboardEvent).key.length>1) return;
        if (this.dirtyChar!==undefined) return;
        let cnt:number = 0;
        let activeSymbolIndex:number = 0;
        const serialized:ICharacterInfo[] = [];
        const rowSet:TextRowSet = this.parent._getRowSet();
        for (const row of rowSet.children) {
            for (const word of row.children) {
                for (let i:number=0;i<word.chars.length;i++) {
                    const charInfo = word.chars[i];
                    if (this.currentCharInfo === charInfo) {
                        this.dirtyRowIndex = rowSet.children.indexOf(row);
                        activeSymbolIndex = cnt;
                    }
                    serialized.push(charInfo);
                    cnt++;
                }
            }
        }
        const newChar:ICharacterInfo = {
            scaleFromCurrFontSize: 1,
            multibyte: false,
            rawChar: (e.nativeEvent as KeyboardEvent).key
        };
        serialized.splice(activeSymbolIndex,0,newChar);
        this.dirtyChar = serialized[serialized.indexOf(newChar)+1]; //
        const strEx:StringEx = new StringEx(serialized);
        this.parent.setStringEx(strEx);
    }

    private startBlinkTimer():void {
        this.blinkTimer = this.parent.setInterval(()=>{
            this.nextBlink();
        },this.blinkInterval);
    }

    private nextBlink():void {
        this.visible = !this.visible;
        this.cursorView.visible = this.visible;
        this.redrawCursorView();
    }

    private getNextWord(delta:-1|1):Optional<Word> {
        const rowSet:TextRowSet = this.parent._getRowSet();
        if (this.currentRow===undefined) return undefined;
        let currentWordIndex:Optional<number> =
            this.currentWord===undefined?undefined: this.currentRow.children.indexOf(this.currentWord);
        if (currentWordIndex!==undefined) currentWordIndex+=delta;
        if (currentWordIndex===undefined || currentWordIndex<0 || currentWordIndex>this.currentRow.children.length-1) {
            let currentRowIndex:number = rowSet.children.indexOf(this.currentRow);
            currentRowIndex+=delta;
            if (currentRowIndex<0 || currentRowIndex>rowSet.children.length-1) return undefined;
            this.currentRow = rowSet.children[currentRowIndex];
            if (delta===1) {
                return this.currentRow.children[0];
            }
            else {
                return this.currentRow.children[this.currentRow.children.length-1];
            }
        }
        return this.currentRow.children[currentWordIndex];
    }

    private moveToNextPosition(delta:-1|1):void{
        let currentCharIndex:Optional<number> =
            (this.currentWord===undefined || this.currentCharInfo===undefined)?
                undefined: this.currentWord.chars.indexOf(this.currentCharInfo);
        if (currentCharIndex!==undefined) currentCharIndex+=delta;
        if (currentCharIndex===undefined || this.currentWord===undefined || currentCharIndex<0 || currentCharIndex>this.currentWord.chars.length-1) {
            const nextWord:Optional<Word> = this.getNextWord(delta);
            if (nextWord===undefined) { // this is empty row
                if (this.currentRow!==undefined && this.currentRow.children.length===0) {
                    this.currentWord = undefined;
                    this.currentCharInfo = undefined;
                    this.currentCharImage = undefined;
                }
                this.restartBlink();
                return;
            }
            this.currentWord = nextWord;
            if (delta===1) currentCharIndex = 0;
            else currentCharIndex = this.currentWord.children.length-1;
        }
        this.currentCharInfo = this.currentWord.chars[currentCharIndex];
        this.currentCharImage = this.currentWord.children[currentCharIndex];
        this.afterCursorMoved(delta);
    }

    private moveToNextRow(delta:-1|1):void {
        if (this.currentRow===undefined) return;
        const rowSet:TextRowSet = this.parent._getRowSet();
        let currentRowIndex:number = rowSet.children.indexOf(this.currentRow);
        if (delta===-1 && currentRowIndex===0) return;
        if (delta===1 && currentRowIndex===rowSet.children.length-1) return;

        let cntForCurrentRow:number = 0;
        for (const word of this.currentRow.children) {
            for (let i:number=0;i<word.chars.length;i++) {
                const charInfo = word.chars[i];
                if (charInfo===this.currentCharInfo) break;
                cntForCurrentRow++;
            }
            if (word===this.currentWord) break;
        }
        currentRowIndex+=delta;
        this.currentRow = rowSet.children[currentRowIndex];
        this.currentWord = undefined;
        this.currentCharInfo = undefined;
        this.currentCharImage = undefined;
        let cntForNextRow:number = 0;
        let stopFlag:boolean = false;
        for (const word of this.currentRow.children) {
            this.currentWord = word;
            for (let i:number=0;i<word.chars.length;i++) {
                this.currentCharInfo = word.chars[i];
                this.currentCharImage = word.children[i];
                cntForNextRow++;
                if (cntForNextRow>cntForCurrentRow) {
                    stopFlag = true;
                    break;
                }
            }
            if (stopFlag) break;
        }
        this.afterCursorMoved(delta);
    }

    private updateCursorViewGeometry():void {
        if (!this.visible) return;
        const rowSet:TextRowSet = this.parent._getRowSet();
        if (this.currentRow===undefined) {
            this.currentRow = rowSet.children[0];
            if (this.currentRow!==undefined) this.currentWord = this.currentRow.children[0];
            if (this.currentWord!==undefined) {
                this.currentWord = this.currentRow.children[0];
                this.currentCharInfo = this.currentWord.chars[0];
                this.currentCharImage = this.currentWord.children[0];
            }
        }

        const posY:number =
            rowSet.pos.y + (this.currentRow?.pos?.y ?? 0);
        const posX:number =
            rowSet.pos.x + (this.currentRow?.pos?.x ?? 0) +
            (this.currentWord?.pos?.x ?? 0) +
            (this.currentCharImage?.pos?.x ?? 0);

        this.cursorView.pos.setXY(posX,posY);
        if (this.currentCharImage!==undefined) {
            this.cursorView.size.set(this.currentCharImage.size);
        } else {
            this.cursorView.size.setWH(this.font.context.fontSize/2,this.font.context.fontSize);
        }

    }

    public clearDirtyTyped():void {
        if (this.dirtyChar===undefined) return;
        const rowSet:TextRowSet = this.parent._getRowSet();
        if (this.dirtyChar.rawChar==='\n' && this.dirtyRowIndex!==undefined) {
            this.currentRow = rowSet.children[this.dirtyRowIndex];
            this.currentWord = this.currentRow.children[this.currentRow.children.length-1];
            this.currentCharInfo = this.currentWord.chars[this.currentWord.chars.length-1];
            this.currentCharImage = this.currentWord.children[this.currentWord.children.length-1];
            this.dirtyRowIndex = undefined;
            this.dirtyChar = undefined;
            return;
        }
        let stopFlag:boolean = false;
        for (const row of rowSet.children) {
            if (stopFlag) break;
            for (const word of row.children) {
                if (stopFlag) break;
                for (let i:number=0;i<word.chars.length;i++) {
                    if (stopFlag) break;
                    const char = word.chars[i];
                    if (char===this.dirtyChar) {
                        stopFlag = true;
                        this.currentRow = row;
                        this.currentWord = word;
                        this.currentCharInfo = char;
                        this.currentCharImage = word.children[i];
                        console.log('cleared');
                    }
                }
            }
        }
        this.dirtyChar = undefined;
    }

    public redrawCursorView():void {
        this.cacheSurface.clear();
        this.updateCursorViewGeometry();
        this.cacheSurface.drawModel(this.cursorView);
    }

    private restartBlink():void {
        this.visible = false;
        this.blinkTimer.reset();
        this.nextBlink();
    }

    private afterCursorMoved(delta:-1|1):void {
        if (this.currentRow!==undefined && !Cursor.isRowTotallyInView(this.parent,this.currentRow,this.parent.getClientRect().height)) {
            this.parent._scrollToTextRow(this.currentRow,delta);
        }
        this.restartBlink();
    }



}
