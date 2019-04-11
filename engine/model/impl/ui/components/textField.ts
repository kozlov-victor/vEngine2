import {Font} from "../../font";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {Rectangle} from "../drawable/rectangle";
import {ScrollableContainer} from "../generic/scrollableContainer";
import {Image} from "../drawable/image";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Game} from "@engine/game";
import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";

type char = string;


export enum TEXT_ALIGN {
    LEFT,
    RIGHT,
    CENTER,
    JUSTIFY
}

class TextInfo {
    allCharsCached: CharInfo[] = [];
    size:Size = new Size();
    pos: Point2d = new Point2d();
    private strings: StringInfo[] = [];

    constructor(private textField: TextField) {}

    reset():void {
        this.allCharsCached = [];
        this.strings = [];
        this.pos.setXY(0,0);
    }

    newString():void {
        this.pos.x = 0;
        if (this.strings.length) {
            this.pos.y += this.textField.getFont().getDefaultSymbolHeight();
        }
        this.strings.push(new StringInfo());
    }

    addChar(c: CharInfo):void {
        this.strings[this.strings.length - 1].chars.push(c);
        this.allCharsCached.push(c);
        c.destRect.setPoint(this.pos);
        this.pos.addX(c.sourceRect.size.width);
    }

    addWord(w: WordInfo):void {
        w.chars.forEach((c: CharInfo) => {
            this.addChar(c);
        });
    }

    revalidate(defaultSymbolHeight: number):void {
        this.size.setWH(0);
        for (let s of this.strings) {
            s.calcSize(defaultSymbolHeight);
            this.size.height += s.height;
            if (s.width > this.size.width) this.size.width = s.width;
        }
    }

    align(textAlign: TEXT_ALIGN):void {
        if (DEBUG && TEXT_ALIGN[textAlign] === undefined) {
            let keys = Object.keys(TEXT_ALIGN).join(', ');
            throw new DebugError(`can not align text: unknown enum type of TEXT_ALIGN: ${textAlign}, expected: ${keys}`);
        }
        this.strings.forEach((s: StringInfo) => {
            s.align(textAlign, this.textField);
        });
    }
}

class CharInfo {
    symbol: char;
    destRect: Rect = new Rect();
    sourceRect: Rect = new Rect();
}

class CharsHolder {
    chars: CharInfo[] = [];

    moveBy(dx: number, dy: number):void {
        for (let ch of this.chars) {
            ch.destRect.point.addXY(dx, dy);
        }
    }

    moveTo(x: number, y: number):void {
        let initialOffsetX: number = 0;
        for (let ch of this.chars) {
            ch.destRect.point.setXY(initialOffsetX + x, y);
            initialOffsetX += ch.sourceRect.size.width;
        }
    }
}

class WordInfo extends CharsHolder {
    width: number = 0;

    revalidate():void {
        this.width = 0;
        for (let ch of this.chars) {
            this.width += ch.destRect.size.width;
        }
    }

    addChar(c: CharInfo):void {
        this.chars.push(c);
        this.width += c.sourceRect.size.width;
    }
}

class StringInfo extends CharsHolder {
    width: number = 0;
    height: number = 0;

    calcSize(defaultSymbolHeight: number):void {
        this.width = 0;
        this.height = defaultSymbolHeight;
        for (let ch of this.chars) {
            this.width += ch.sourceRect.size.width;
        }
    }

    private toWords(): WordInfo[] {
        const res: WordInfo[] = [];
        let currWord: WordInfo = new WordInfo();
        for (let ch of this.chars) {
            if (ch.symbol === ' ') {
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

    align(textAlign: TEXT_ALIGN, textField: TextField):void {
        switch (textAlign) {
            case TEXT_ALIGN.LEFT:
                break;
            case TEXT_ALIGN.CENTER:
                let offset = textField.size.width - this.width;
                if (offset < 0) return;
                offset /= 2;
                this.moveBy(offset, 0);
                break;
            case TEXT_ALIGN.RIGHT:
                offset = textField.size.width - this.width;
                if (offset < 0) return;
                this.moveBy(offset, 0);
                break;
            case TEXT_ALIGN.JUSTIFY:
                let words: WordInfo[] = this.toWords();
                if (words.length <= 1) return;
                if (!words[0].chars.length) return;
                let totalWordsWidth: number = 0;
                words.forEach((w: WordInfo) => {
                    w.revalidate();
                    totalWordsWidth += w.width;
                });
                let totalSpaceWidth: number = textField.size.width - totalWordsWidth;
                let oneSpaceWidth: number = totalSpaceWidth / (words.length - 1);
                let initialPosY: number = this.chars[0].destRect.point.y;
                let currXPointer: number = this.chars[0].destRect.point.x;
                for (let i:number = 0; i < words.length; i++) {
                    let w: WordInfo = words[i];
                    w.moveTo(currXPointer, initialPosY);
                    currXPointer += w.width + oneSpaceWidth;
                }
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown TEXT_ALIGN value: ${textAlign}`);

        }
    }
}


export class TextField extends ScrollableContainer {

    readonly type = 'TextField';
    textAlign: TEXT_ALIGN = TEXT_ALIGN.LEFT;
    border: Rectangle = null;

    private _textInfo: TextInfo;
    private _symbolImage:Image;
    private _text: string = '';
    private _font: Font = null;


    constructor(game:Game) {
        super(game);
        this._textInfo = new TextInfo(this);
        this._symbolImage = new Image(this.game);
        this._initScrolling({vertical: true});
    }


    revalidate():void {
        super.revalidate();
        if (DEBUG && !this._font) throw new DebugError(`font is not provided`);
        if (DEBUG && !this._font.getResourceLink()) throw new DebugError(`can not render textField: font resource link is not set`);
    }

    private _getCharInfo(c: char): CharInfo {
        let charRect: Rect =
            this._font.fontContext.symbols[c] ||
            this._font.fontContext.symbols[' '];
        let charInfo = new CharInfo();
        charInfo.symbol = c;
        charInfo.sourceRect = charRect;
        charInfo.destRect.setSize(charRect.size);
        return charInfo;
    }

    onGeometryChanged():void {
        super.onGeometryChanged();

        const textInfo:TextInfo = this._textInfo;
        textInfo.reset();
        textInfo.newString();
        const text: string = this._text;

        const strings:string[] = text.split('\n');
        strings.forEach((str:string, i:number) => {
            let words:string[] = str.split(' ');
            words.forEach((w: string, i: number) => {
                let wordInfo:WordInfo = new WordInfo();
                for (let k:number = 0; k < w.length; k++) {
                    let charInfo: CharInfo = this._getCharInfo(w[k]);
                    wordInfo.addChar(charInfo);
                }
                if (this.maxWidth && textInfo.pos.x + wordInfo.width > this.maxWidth && i < words.length - 1) {
                    textInfo.newString();
                }
                textInfo.addWord(wordInfo);
                if (i < str.length - 1) {
                    let spaceChar = this._getCharInfo(' ');
                    textInfo.addChar(spaceChar);
                }
            });
            if (i < strings.length - 1) {
                textInfo.newString();
            }
        });
        textInfo.revalidate(this._font.getDefaultSymbolHeight());
        textInfo.align(this.textAlign);
        this.size.width = textInfo.size.width;
        if (this.maxHeight !== 0 && textInfo.size.height > this.maxHeight) {
            this.size.height = this.maxHeight;
        } else {
            this.size.height = textInfo.size.height;
        }
        if (this.border) {
            this.border.size.set(this.size);
        }
        this.updateScrollSize(textInfo.size.height,this.size.height);
    }

    setText(text:string = '') {
        this._text = text.toString();
        this._dirty = true;
    }

    getText():string {
        return this._text
    }

    setFont(font:Font):void {
        font.revalidate();
        this._font = font;
        this.setText(this._text);
    }



    getFont():Font {
        return this._font;
    }


    draw():boolean {
        let renderer:AbstractRenderer = this.game.getRenderer();
        renderer.lockRect(this.getWorldRect());
        renderer.save();
        if (this.vScrollInfo.offset) renderer.translate(0, -this.vScrollInfo.offset, 0);

        this._symbolImage.setResourceLink(this._font.getResourceLink());
        for (let charInfo of this._textInfo.allCharsCached) {

            if (charInfo.destRect.point.y - this.vScrollInfo.offset > this.size.height) continue;
            if (charInfo.destRect.point.y + charInfo.destRect.size.height - this.vScrollInfo.offset < 0) continue;

            this._symbolImage.getSrcRect().set(charInfo.sourceRect);
            this._symbolImage.size.set(charInfo.sourceRect.size);
            this._symbolImage.pos.set(charInfo.destRect.point);

            this._symbolImage.render();
        }
        renderer.restore();
        renderer.unlockRect();
        if (this.border) this.border.render();
        return true;
    }

}
