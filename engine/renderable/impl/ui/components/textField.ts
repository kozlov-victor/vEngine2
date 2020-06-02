import {Font, IRectViewJSON} from "../../general/font";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {ScrollableContainer} from "../abstract/scrollableContainer";
import {Image} from "../../general/image";
import {AbstractRenderer, IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Game} from "@engine/core/game";
import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";

type char = string;
const SPACE = ' ';

export const enum TEXT_ALIGN {
    LEFT,
    RIGHT,
    CENTER,
    JUSTIFY
}

export const enum WORD_BRAKE {
    PREDEFINED,
    FIT
}

class TextInfo {
    public allCharsCached: CharInfo[] = [];
    public size:Size = new Size();
    public pos: Point2d = new Point2d();
    private _strings: StringInfo[] = [];

    constructor(private textField: TextField) {}

    public reset():void {
        this.allCharsCached = [];
        this._strings = [];
        this.pos.setXY(this.textField.paddingLeft,this.textField.paddingTop);
    }

    public newString():void {
        this.pos.x = this.textField.paddingLeft;
        if (this._strings.length) {
            this.pos.y += this.textField.getFont().fontContext.lineHeight;
        }
        this._strings.push(new StringInfo());
    }

    public addChar(c: CharInfo):void {
        this._strings[this._strings.length - 1].chars.push(c);
        this.allCharsCached.push(c);
        c.destRect.setPoint(this.pos);
        c.destRect.addXY(c.destOffsetX,c.destOffsetY);
        this.pos.addX(c.sourceRect.width+c.destOffsetX);
    }

    public addWord(w: WordInfo):void {
        for (const c of w.chars) {
            this.addChar(c);
        }
    }

    public revalidate(defaultSymbolHeight: number):void {
        this.size.setWH(
            this.textField.paddingLeft + this.textField.paddingRight,
            this.textField.paddingTop + this.textField.paddingBottom
        );
        for (const s of this._strings) {
            s.calcSize(defaultSymbolHeight);
            this.size.height += s.height;
            if (s.width > this.size.width) this.size.width = s.width;
        }
    }

    public align(textAlign: TEXT_ALIGN):void {
        for (const s of this._strings) {
            s.align(textAlign, this.textField);
        }
    }
}

class CharInfo {
    public symbol: char;
    public destRect: Rect = new Rect();
    public sourceRect: Rect = new Rect();
    public destOffsetX: number = 0;
    public destOffsetY:number = 0;
}

class CharsHolder {
    public chars: CharInfo[] = [];

    public moveBy(dx: number, dy: number):void {
        for (const ch of this.chars) {
            ch.destRect.addXY(dx, dy);
        }
    }

    public moveTo(x: number, y: number):void {
        let initialOffsetX: number = 0;
        for (const ch of this.chars) {
            ch.destRect.setXY(initialOffsetX + x, y);
            initialOffsetX += ch.sourceRect.width;
        }
    }
}

class WordInfo extends CharsHolder {
    public width: number = 0;

    public revalidate():void {
        this.width = 0;
        for (const ch of this.chars) {
            this.width += ch.destRect.width;
        }
    }

    public addChar(c: CharInfo):void {
        this.chars.push(c);
        this.width += c.sourceRect.width;
    }
}

class StringInfo extends CharsHolder {
    public width: number = 0;
    public height: number = 0;

    public calcSize(defaultSymbolHeight: number):void {
        this.width = 0;
        this.height = defaultSymbolHeight;
        for (const ch of this.chars) {
            this.width += ch.sourceRect.width;
        }
    }

    public align(textAlign: TEXT_ALIGN, textField: TextField):void {
        const AVAILABLE_WIDTH:number =  textField.size.width - textField.paddingLeft - textField.paddingRight;
        switch (textAlign) {
            case TEXT_ALIGN.LEFT:
                break;
            case TEXT_ALIGN.CENTER:
                let offset = AVAILABLE_WIDTH - this.width;
                if (offset < 0) return;
                offset /= 2;
                this.moveBy(offset, 0);
                break;
            case TEXT_ALIGN.RIGHT:
                offset = AVAILABLE_WIDTH - this.width;
                if (offset < 0) return;
                this.moveBy(offset, 0);
                break;
            case TEXT_ALIGN.JUSTIFY:
                const words: WordInfo[] = this.toWords();
                if (words.length <= 1) return;
                if (!words[0].chars.length) return;
                let totalWordsWidth: number = 0;
                for (const w of words) {
                    w.revalidate();
                    totalWordsWidth += w.width;
                }
                const totalSpaceWidth: number = AVAILABLE_WIDTH - totalWordsWidth;
                const oneSpaceWidth: number = totalSpaceWidth / (words.length - 1);
                if (oneSpaceWidth>textField.getFont().fontContext.lineHeight*2) return;
                const initialPosY: number = this.chars[0].destRect.y;
                let currXPointer: number = this.chars[0].destRect.x;
                for (const w of words) {
                    w.moveTo(currXPointer, initialPosY);
                    currXPointer += w.width + oneSpaceWidth;
                }
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown TEXT_ALIGN value: ${textAlign}`);

        }
    }

    private toWords(): WordInfo[] {
        const res: WordInfo[] = [];
        let currWord: WordInfo = new WordInfo();
        for (const ch of this.chars) {
            if (ch.symbol === SPACE) {
                if (currWord.chars.length) {
                    res.push(currWord);
                    currWord = new WordInfo();
                }
            } else {
                currWord.chars.push(ch);
            }
        }
        if (res.indexOf(currWord) === -1) res.push(currWord);
        return res;
    }
}


export class TextField extends ScrollableContainer {

    public readonly type = 'TextField';
    private _textAlign: TEXT_ALIGN = TEXT_ALIGN.LEFT;
    private _wordBreak: WORD_BRAKE = WORD_BRAKE.PREDEFINED;

    private readonly _textInfo: TextInfo;
    private _symbolImage:Image;
    private _text: string = '';
    private _font: Font;

    constructor(game:Game) {
        super(game);
        this._textInfo = new TextInfo(this);
        this._symbolImage = new Image(this.game);
        this._initScrolling({vertical: true});
    }


    public revalidate():void {
        super.revalidate();
        if (DEBUG && !this._font) throw new DebugError(`font is not provided`);
        this._font.revalidate();
    }

    public onGeometryChanged():void {

        const textInfo:TextInfo = this._textInfo;
        textInfo.reset();
        textInfo.newString();
        let text: string = this._text;
        if (this._wordBreak===WORD_BRAKE.FIT) {
            text = text.split('\n').map((str:string)=>str.trim()).join(' ');
        }

        const strings:string[] = text.split('\n');
        const MAX_WIDTH:number = this.maxWidth - this.paddingLeft - this.paddingRight;
        for (let i:number=0;i<strings.length;i++) {
            const str = strings[i];

            // render string as is
            if (this._wordBreak===WORD_BRAKE.PREDEFINED) {
                const wordInfo:WordInfo = new WordInfo();
                for (let k:number = 0; k < str.length; k++) {
                    const charInfo: CharInfo = this._getCharInfo(str[k]);
                    wordInfo.addChar(charInfo);
                }
                textInfo.addWord(wordInfo);
            } else {
                // break string by worlds and render each word separately
                const words:string[] = str.split(SPACE);
                for (let j:number=0;j<words.length;j++) {
                    const w:string = words[j];
                    const wordInfo:WordInfo = new WordInfo();
                    for (let k:number = 0; k < w.length; k++) {
                        const charInfo: CharInfo = this._getCharInfo(w[k]);
                        wordInfo.addChar(charInfo);
                    }
                    if (this.maxWidth && textInfo.pos.x + wordInfo.width > MAX_WIDTH && i < words.length - 1) {
                        textInfo.newString();
                    }
                    textInfo.addWord(wordInfo);
                    if (i < str.length - 1) {
                        const spaceChar = this._getCharInfo(SPACE);
                        textInfo.addChar(spaceChar);
                    }
                }
            }
            if (i < strings.length - 1) {
                textInfo.newString();
            }
        }

        textInfo.revalidate(this._font.fontContext.lineHeight);
        this.size.width = textInfo.size.width;
        // if (this.maxWidth && this.size.width>this.maxWidth)
        //     this.size.width = this.maxWidth;

        if (this.maxHeight !== 0 && textInfo.size.height > this.maxHeight) {
            this.size.height = this.maxHeight;
        } else {
            this.size.height = textInfo.size.height;
        }

        textInfo.align(this._textAlign);
        this.updateScrollSize(textInfo.size.height,this.size.height);

        super.onGeometryChanged();
    }

    public setText(text:string|number = ''):void {
        this._text = text+'';
        this.setDirty();
    }

    public setTextAlign(ta:TEXT_ALIGN):void{
        this._textAlign = ta;
        this.setDirty();
    }

    public setWordBreak(wb:WORD_BRAKE):void{
        this._wordBreak = wb;
        this.setDirty();
    }

    public getText():string {
        return this._text;
    }

    public setFont(font:Font):void {
        this._font = font;
        this.setDirty();
    }


    public getFont():Font {
        return this._font;
    }


    public draw():void {

        if (this.background) this.background.render();

        const renderer:AbstractRenderer = this.game.getRenderer();
        // const worldRectTmp:Rect = Rect.fromPool();
        // worldRectTmp.setPointAndSize(this.getWorldPosition(),this.size);
        // worldRectTmp.addXY(this.marginLeft+this.paddingLeft,this.marginTop+this.paddingTop);
        // worldRectTmp.addWH(
        //     -this.marginRight-this.paddingRight-this.marginLeft-this.paddingLeft,
        //     -this.marginBottom-this.paddingBottom-this.marginTop-this.paddingTop
        // );


        //renderer.lockRect(worldRectTmp); // todo
        renderer.transformSave();
        if (this.vScrollInfo.offset) renderer.transformTranslate(0, -this.vScrollInfo.offset, 0);

        this._symbolImage.setResourceLink(this._font.getResourceLink());
        for (const charInfo of this._textInfo.allCharsCached) {

            if (charInfo.destRect.y - this.vScrollInfo.offset > this.size.height) continue;
            if (charInfo.destRect.y + charInfo.destRect.height - this.vScrollInfo.offset < 0) continue;

            this._symbolImage.getSrcRect().set(charInfo.sourceRect);
            this._symbolImage.size.setWH(charInfo.sourceRect.width,charInfo.sourceRect.height);
            this._symbolImage.pos.setXY(charInfo.destRect.x,charInfo.destRect.y);

            if (this._symbolImage.size.height===0) continue;

            this._symbolImage.render();
        }
        renderer.transformRestore();
        //renderer.unlockRect();
    }

    private _getDefaultSymbolRect():IRectViewJSON {
        let defaultChar:string = SPACE;
        if (!this._font.fontContext.symbols[SPACE]) {
            const firstSymbol:string = Object.keys(this._font.fontContext.symbols)[0];
            if (DEBUG && !firstSymbol) throw new DebugError(`no symbols in font`);
            defaultChar = firstSymbol;
        }
        return this._font.fontContext.symbols[defaultChar];
    }

    private _getCharInfo(c: char): CharInfo {
        const charRect: IRectViewJSON =
            this._font.fontContext.symbols[c] || this._getDefaultSymbolRect();
        const charInfo = new CharInfo();
        charInfo.symbol = c;
        charInfo.sourceRect = new Rect();
        charInfo.sourceRect.fromJSON(charRect);
        charInfo.destRect.setWH(charRect.width,charRect.height);
        charInfo.destOffsetX = charRect.destOffsetX;
        charInfo.destOffsetY = charRect.destOffsetY;
        return charInfo;
    }

}
