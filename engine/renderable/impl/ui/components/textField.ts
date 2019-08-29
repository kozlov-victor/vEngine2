import {Font, IRectViewJSON} from "../../general/font";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {ScrollableContainer} from "../abstract/scrollableContainer";
import {Image} from "../../geometry/image";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Game} from "@engine/core/game";
import {Size} from "@engine/geometry/size";
import {Point2d} from "@engine/geometry/point2d";

type char = string;


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
    private strings: StringInfo[] = [];

    constructor(private textField: TextField) {}

    public reset():void {
        this.allCharsCached = [];
        this.strings = [];
        this.pos.setXY(this.textField.paddingLeft,this.textField.paddingTop);
    }

    public newString():void {
        this.pos.x = this.textField.paddingLeft;
        if (this.strings.length) {
            this.pos.y += this.textField.getFont().fontContext.lineHeight;
        }
        this.strings.push(new StringInfo());
    }

    public addChar(c: CharInfo):void {
        this.strings[this.strings.length - 1].chars.push(c);
        this.allCharsCached.push(c);
        c.destRect.setPoint(this.pos);
        c.destRect.point.addXY(c.destOffsetX,c.destOffsetY);
        this.pos.addX(c.sourceRect.size.width+c.destOffsetX);
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
        for (const s of this.strings) {
            s.calcSize(defaultSymbolHeight);
            this.size.height += s.height;
            if (s.width > this.size.width) this.size.width = s.width;
        }
    }

    public align(textAlign: TEXT_ALIGN):void {
        for (const s of this.strings) {
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
            ch.destRect.point.addXY(dx, dy);
        }
    }

    public moveTo(x: number, y: number):void {
        let initialOffsetX: number = 0;
        for (const ch of this.chars) {
            ch.destRect.point.setXY(initialOffsetX + x, y);
            initialOffsetX += ch.sourceRect.size.width;
        }
    }
}

class WordInfo extends CharsHolder {
    public width: number = 0;

    public revalidate():void {
        this.width = 0;
        for (const ch of this.chars) {
            this.width += ch.destRect.size.width;
        }
    }

    public addChar(c: CharInfo):void {
        this.chars.push(c);
        this.width += c.sourceRect.size.width;
    }
}

class StringInfo extends CharsHolder {
    public width: number = 0;
    public height: number = 0;

    public calcSize(defaultSymbolHeight: number):void {
        this.width = 0;
        this.height = defaultSymbolHeight;
        for (const ch of this.chars) {
            this.width += ch.sourceRect.size.width;
        }
    }

    public align(textAlign: TEXT_ALIGN, textField: TextField):void {
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
                const words: WordInfo[] = this.toWords();
                if (words.length <= 1) return;
                if (!words[0].chars.length) return;
                let totalWordsWidth: number = 0;
                for (const w of words) {
                    w.revalidate();
                    totalWordsWidth += w.width;
                }
                const totalSpaceWidth: number = textField.size.width - totalWordsWidth;
                const oneSpaceWidth: number = totalSpaceWidth / (words.length - 1);
                if (oneSpaceWidth>textField.getFont().fontContext.lineHeight*2) return;
                const initialPosY: number = this.chars[0].destRect.point.y;
                let currXPointer: number = this.chars[0].destRect.point.x;
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
}


export class TextField extends ScrollableContainer {

    public readonly type = 'TextField';
    private textAlign: TEXT_ALIGN = TEXT_ALIGN.LEFT;
    private wordBreak: WORD_BRAKE = WORD_BRAKE.PREDEFINED;

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
        if (this.wordBreak===WORD_BRAKE.FIT) {
            text = text.split('\n').map((str:string)=>str.trim()).join(' ');
        }

        const strings:string[] = text.split('\n');
        const MAX_WIDTH:number = this.maxWidth - this.paddingLeft - this.paddingRight;
        for (let i:number=0;i<strings.length;i++) {
            const str = strings[i];
            const words:string[] = str.split(' ');
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
                    const spaceChar = this._getCharInfo(' ');
                    textInfo.addChar(spaceChar);
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

        textInfo.align(this.textAlign);
        this.updateScrollSize(textInfo.size.height,this.size.height);

        super.onGeometryChanged();
    }

    public setText(text:string|number = ''):void {
        this._text = text+'';
        this._dirty = true;
    }

    public setTextAlign(ta:TEXT_ALIGN):void{
        this.textAlign = ta;
        this._dirty = true;
    }

    public setWordBreak(wb:WORD_BRAKE):void{
        this.wordBreak = wb;
        this._dirty = true;
    }

    public getText():string {
        return this._text;
    }

    public setFont(font:Font):void {
        this._font = font;
        this._dirty = true;
    }


    public getFont():Font {
        return this._font;
    }


    public draw():boolean {

        if (this.background) this.background.render();

        const renderer:AbstractRenderer = this.game.getRenderer();
        const worldRectTmp:Rect = Rect.fromPool();
        worldRectTmp.set(this.getWorldRect());
        worldRectTmp.point.addXY(this.marginLeft+this.paddingLeft,this.marginTop+this.paddingTop);
        worldRectTmp.size.addWH(
            -this.marginRight-this.paddingRight-this.paddingLeft-this.paddingLeft,
            -this.marginBottom-this.paddingBottom-this.marginTop-this.paddingTop
        );
        renderer.lockRect(worldRectTmp);
        worldRectTmp.release();
        renderer.save();
        if (this.vScrollInfo.offset) renderer.translate(0, -this.vScrollInfo.offset, 0);

        this._symbolImage.setResourceLink(this._font.getResourceLink());
        for (const charInfo of this._textInfo.allCharsCached) {

            if (charInfo.destRect.point.y - this.vScrollInfo.offset > this.size.height) continue;
            if (charInfo.destRect.point.y + charInfo.destRect.size.height - this.vScrollInfo.offset < 0) continue;

            this._symbolImage.getSrcRect().set(charInfo.sourceRect);
            this._symbolImage.size.set(charInfo.sourceRect.size);
            this._symbolImage.pos.set(charInfo.destRect.point);

            if (this._symbolImage.size.height===0) continue;

            this._symbolImage.render();
        }
        renderer.restore();
        renderer.unlockRect();
        return true;
    }

    private _getDefaultSymbolRect():IRectViewJSON {
        let defaultChar:string = ' ';
        if (!this._font.fontContext.symbols[' ']) {
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
