import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {Timer} from "@engine/misc/timer";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {TextRow} from "@engine/renderable/impl/ui/textField/_internal/textRow";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {ICharacterInfo} from "@engine/renderable/impl/ui/textField/_internal/stringEx";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Optional} from "@engine/core/declarations";
import {Font} from "@engine/renderable/impl/general/font/font";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IRect} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {TypeHelper} from "@engine/renderable/impl/ui/textField/editTextField/typeHelper";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import IFontSymbolInfo = FontTypes.IFontSymbolInfo;


export class Cursor {

    private visible:boolean = false;
    private blinkTimer:Timer;
    private blinkInterval:number = 1000;

    private rowSetContainer:RenderableModel;
    private cacheSurface:DrawingSurface;
    private cursorView:Rectangle = new Rectangle(this.game);

    private typeHelper:TypeHelper = new TypeHelper(this,this.parent);

    public currentRow:Optional<TextRow>;
    public currentWord:Optional<Word>;
    public currentCharInfo:Optional<Readonly<ICharacterInfo>>;
    public currentCharImage:Optional<CharacterImage>;



    constructor(private game:Game,private parent:EditTextField,private font:Font) {
        this.cursorView.visible = false;
        this.cursorView.lineWidth = 0;
        this.listenToMouse();
    }

    public start(rowSetContainer:RenderableModel):void {
        this.rowSetContainer = rowSetContainer;
        this.onClientRectChanged(this.parent.getClientRect());
        if (this.blinkTimer===undefined) this.startBlinkTimer();
    }

    public onClientRectChanged(rect:Readonly<IRect>):void{
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
            if (!this.parent.isFocused()) return;
            if (this.typeHelper.isDirty()) return;
            switch (e.button) {
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
                    this.typeHelper.typeSymbol(e);
                    break;
            }
        };
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>listener(e));
        this.game.getCurrentScene().keyboardEventHandler.on(KEYBOARD_EVENTS.keyRepeated, e=>listener(e));
    }


    private startBlinkTimer():void {
        this.blinkTimer = this.parent.setInterval(()=>{
            this.nextBlink();
        },this.blinkInterval);
    }

    private nextBlink():void {
        if (!this.parent.isFocused()) this.visible = false;
        else this.visible = !this.visible;
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

    public moveToNextPosition(delta:-1|1):void{
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
        this.afterCursorMoved();
    }

    public moveToNextRow(delta:-1|1):void {
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
        this.afterCursorMoved();
    }

    public placeToDefaultPosition():void {
        this.currentRow = this.parent._getRowSet().children[0];
        if (this.currentRow!==undefined) this.currentWord = this.currentRow.children[0];
        if (this.currentWord!==undefined) {
            this.currentWord = this.currentRow.children[0];
            this.currentCharInfo = this.currentWord.chars[0];
            this.currentCharImage = this.currentWord.children[0];
        }
    }

    private updateCursorViewGeometry():void {
        if (!this.visible) return;
        if (this.currentRow===undefined) this.placeToDefaultPosition();

        const rowSet:TextRowSet = this.parent._getRowSet();
        const symbolInfo:Optional<IFontSymbolInfo> =
            this.currentCharImage===undefined?
                undefined:
                this.font.getSymbolInfoByChar(this.currentCharImage.getCharacterInfo().rawChar);

        let posY:number = rowSet.pos.y + this.font.context.base - this.font.context.lineHeight;
        if (this.currentRow!==undefined) {
            posY+=this.currentRow.pos.y;
        }

        let posX:number = rowSet.pos.x;
        if (this.currentWord!==undefined) {
            posX+=this.currentWord.pos.x;
        }
        if (this.currentRow!==undefined) {
            posX+=this.currentRow.pos.x;
        }
        if (this.currentCharImage!==undefined) {
            posX+=this.currentCharImage.pos.x;
        }
        this.cursorView.pos.setXY(posX,posY);

        if (this.currentCharImage!==undefined && symbolInfo!==undefined && symbolInfo.widthAdvanced>0) {
            const scaleFromCurrFontSize:number = this.currentCharImage.getCharacterInfo().scaleFromCurrFontSize;
            this.cursorView.size.setWH(
                symbolInfo.widthAdvanced * scaleFromCurrFontSize,
                this.font.context.lineHeight * scaleFromCurrFontSize
            );
        } else {
            this.cursorView.size.setWH(this.font.context.fontSize/2,this.font.context.lineHeight);
        }
    }

    public redrawCursorView():void {
        this.cacheSurface.clear();
        this.updateCursorViewGeometry();
        this.cursorView.fillColor = this.parent.cursorColor;
        this.cacheSurface.drawModel(this.cursorView);
    }

    public clearDirtyTyped():void {
        this.typeHelper.clearDirtyTyped();
    }

    private restartBlink():void {
        this.visible = false;
        this.blinkTimer.reset();
        this.nextBlink();
    }

    public afterCursorMoved():void {
        if (this.currentRow!==undefined) this.parent._requestFocusForTextRow(this.currentRow);
        this.restartBlink();
    }



}
