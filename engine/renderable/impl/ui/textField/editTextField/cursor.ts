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

export class Cursor {

    private currentRow:Optional<TextRow>;
    private currentWord:Optional<Word>;
    private currentCharInfo:Optional<Readonly<ICharacterInfo>>;
    private currentCharImage:Optional<CharacterImage>;

    private visible:boolean = false;
    private blinkTimer:Timer;
    private blinkInterval:number = 1000;

    private rowSet:TextRowSet;
    private cacheSurface:DrawingSurface;
    private cursorView:Rectangle = new Rectangle(this.game);

    constructor(private game:Game,private parent:EditTextField,private font:Font) {
        this.cursorView.visible = false;
        this.cursorView.lineWidth = 0;
        this.listenToMouse();
        (window as any).c = this;
    }

    public start(textRowSet:TextRowSet,cacheSurface:DrawingSurface):void {
        this.rowSet = textRowSet;
        this.cacheSurface = cacheSurface;
        if (this.blinkTimer===undefined) this.startBlinkTimer();
    }

    private listenToMouse():void {
        this.game.getCurrScene().on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.key) {
                case KEYBOARD_KEY.RIGHT:
                    this.moveToNextPosition(1);
                    break;
                case KEYBOARD_KEY.LEFT:
                    this.moveToNextPosition(-1);
                    break;
            }
        });
    }

    private startBlinkTimer():void {
        this.blinkTimer = this.parent.setInterval(()=>{
            this.nextBlink();
        },this.blinkInterval);
    }

    private nextBlink():void {
        this.visible = !this.visible;
        this.cursorView.visible = this.visible;
        this.parent.__requestTextRedraw();
    }

    private getNextWord(delta:-1|1):Optional<Word> {
        if (this.currentRow===undefined) return undefined;
        let currentWordIndex:Optional<number> =
            this.currentWord===undefined?undefined: this.currentRow.children.indexOf(this.currentWord);
        if (currentWordIndex!==undefined) currentWordIndex+=delta;
        if (currentWordIndex===undefined || currentWordIndex<0 || currentWordIndex>this.currentRow.children.length-1) {
            let currentRowIndex:number = this.rowSet.children.indexOf(this.currentRow);
            currentRowIndex+=delta;
            if (currentRowIndex<0 || currentRowIndex>this.rowSet.children.length-1) return undefined;
            this.currentRow = this.rowSet.children[currentRowIndex];
            if (delta===1) {
                return this.currentRow.children[0];
            }
            else {
                return this.currentRow.children[this.currentRow.children.length-1];
            }
        }
        return this.currentRow.children[currentWordIndex];
    }

    private restartBlink():void {
        this.visible = false;
        this.blinkTimer.reset();
        this.nextBlink();
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
        this.restartBlink();
    }

    public updateCursorView():void {
        if (!this.visible) return;
        if (this.currentRow===undefined) {
            this.currentRow = this.rowSet.children[0];
            if (this.currentRow!==undefined) this.currentWord = this.currentRow.children[0];
            if (this.currentWord!==undefined) {
                this.currentWord = this.currentRow.children[0];
                this.currentCharInfo = this.currentWord.chars[0];
                this.currentCharImage = this.currentWord.children[0];
            }
        }

        const posY:number =
            this.cacheSurface.pos.y + this.rowSet.pos.y + (this.currentRow?.pos?.y ?? 0);
        const posX:number =
            this.cacheSurface.pos.x + this.rowSet.pos.x + (this.currentRow?.pos?.x ?? 0) +
            (this.currentWord?.pos?.x ?? 0) +
            (this.currentCharImage?.pos?.x ?? 0);

        this.cursorView.pos.setXY(posX,posY);
        if (this.currentCharImage!==undefined) {
            this.cursorView.size.set(this.currentCharImage.size);
        } else {
            this.cursorView.size.setWH(this.font.context.fontSize/2,this.font.context.fontSize);
        }

        this.cacheSurface.drawModel(this.cursorView);
    }



}
