import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {DebugError} from "@engine/debug/debugError";
import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";
import {IRectJSON} from "@engine/geometry/rect";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {MarkableGameObjectContainer} from "@engine/renderable/impl/ui/textField/_internal/markableGameObjectContainer";
import {Color} from "@engine/renderer/common/color";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {FrameSkipper} from "@engine/misc/frameSkipper";
import {TextRow} from "@engine/renderable/impl/ui/textField/_internal/textRow";
import {CharacterImage} from "@engine/renderable/impl/ui/textField/_internal/characterImage";
import {Word} from "@engine/renderable/impl/ui/textField/_internal/word";
import {StringEx} from "@engine/renderable/impl/ui/textField/_internal/stringEx";


export class TextField extends WidgetContainer {

    public readonly type:string = 'TextField';
    public readonly textColor:Color = Color.RGB(122,122,122);

    protected rowSet:TextRowSet;
    protected readonly rowSetContainer:MarkableGameObjectContainer = new MarkableGameObjectContainer(this.game);
    protected _textEx:StringEx = StringEx.empty();
    protected cacheSurface:DrawingSurface;

    private alignTextContentVertical:AlignTextContentVertical = AlignTextContentVertical.TOP;
    private alignTextContentHorizontal:AlignTextContentHorizontal = AlignTextContentHorizontal.LEFT;
    private alignText:AlignText = AlignText.LEFT;
    private wordBrake:WordBrake = WordBrake.FIT;
    private pixelPerfect:boolean = false;

    private _text:string = '';
    private frameSkipper:FrameSkipper = new FrameSkipper(this.game);
    private _autosize:boolean = false;
    private measurer:TextRowSet;

    private needTextRedraw:boolean = false;

    constructor(game:Game,protected font:Font,protected useCache:boolean = true) {
        super(game);
        if (DEBUG && !font) {
            throw new DebugError(`can not create textField: font is not passed`);
        }
        this.appendChild(this.rowSetContainer);
        this.size.setWH(300,100);
        this.rowSetContainer.size.set(this.size);
        this.textColor.observe(()=>this.requestTextRedraw());
    }

    public setText(text:string|number):void{
        const strText = text.toString();
        if (strText===this._text) return;
        this._text = strText;
        this._textEx = StringEx.fromRaw(strText);
        this.markAsDirty();
    }

    public getText():string{
        return this._text;
    }

    public setAutoSize(val:boolean):void {
        this._autosize = val;
        this.markAsDirty();
    }

    public getAutoSize():boolean {
        return this._autosize;
    }

    public setPixelPerfect(val:boolean):void {
        this.pixelPerfect = val;
        this.markAsDirty();
    }

    public getPixelPerfect():boolean {
        return this.pixelPerfect;
    }

    public revalidate():void {
        if (this.useCache) this._revalidateWithCache();
        else this._revalidateWithoutCache();
    }

    public setProps(props: ITextFieldProps):void {
        super.setProps(props);
        if (props.textColor) this.textColor.setRGBA(props.textColor.r,props.textColor.g,props.textColor.b,props.textColor.a);
        if (props.text!==undefined) this.setText(props.text);
        if (props.autoSize!==undefined) this.setAutoSize(props.autoSize);
        if (props.pixelPerfect!==undefined) this.setPixelPerfect(props.pixelPerfect);
        if (props.font!==undefined) this.setFont(props.font as Font);
        if (props.alignText!==undefined) this.setAlignText(props.alignText);
        if (props.alignTextContentVertical!==undefined) this.setAlignTextContentVertical(props.alignTextContentVertical);
        if (props.alignTextContentHorizontal!==undefined) this.setAlignTextContentHorizontal(props.alignTextContentHorizontal);
        if (props.wordBrake!==undefined) this.setWordBrake(props.wordBrake);
    }

    private _revalidateWithCache():void {
        if (DEBUG && !this._autosize && (this.size.width===0 || this.size.height===0)) {
            throw new DebugError(`can not setText: TextField size.width and/or size.height is not defined`);
        }
        if (this._autosize) this.calculateAutoSize();
        super.revalidate();
        let rectIsDirty:boolean = false;
        const clientRect:Readonly<IRectJSON> = this.getClientRect();
        this.rowSetContainer.pos.set(clientRect);
        this.rowSetContainer.size.set(clientRect);
        if (this.cacheSurface===undefined) {
            this.cacheSurface = new DrawingSurface(this.game,clientRect);
            this.rowSetContainer.appendChild(this.cacheSurface);
        } else {
            if (!this.cacheSurface.size.equal(clientRect)) {
                rectIsDirty = true;
                this.cacheSurface.destroy();
                const cacheSurface:DrawingSurface = new DrawingSurface(this.game,clientRect);
                cacheSurface.setPixelPerfect(this.pixelPerfect);
                this.rowSetContainer.replaceChild(this.cacheSurface,cacheSurface);
                this.rowSetContainer.markAsDirty();
                this.cacheSurface = cacheSurface;
            }
        }
        if (this.rowSet===undefined || rectIsDirty) {
            this.rowSet = new TextRowSet(this.game,this.font,clientRect,this.textColor);
        }
        this._setText();
    }

    private _revalidateWithoutCache():void {
        const clientRect: Readonly<IRectJSON> = this.getClientRect();
        let rectIsDirty: boolean = true;
        if (this.rowSet !== undefined) {
            const currentClientRect = this.rowSet.getDestRect();
            rectIsDirty =
                clientRect.x !== currentClientRect.x ||
                clientRect.y !== currentClientRect.y ||
                clientRect.width !== currentClientRect.width ||
                clientRect.height !== currentClientRect.height;
        }
        if (this.rowSet === undefined || rectIsDirty) {
            if (this.rowSet !== undefined) this.rowSet.removeSelf();
            this.rowSet = new TextRowSet(this.game, this.font, clientRect, this.textColor);
            this.rowSetContainer.appendChild(this.rowSet);
        }
        this.rowSetContainer.pos.set(clientRect);
        this.rowSetContainer.size.set(clientRect);
        this._setText();
        if (this._autosize) {
            this.size.setWH(
                this.rowSet.size.width + this.marginLeft + this.paddingLeft + this.marginRight + this.paddingRight,
                this.rowSet.size.height + this.marginTop + this.paddingTop + this.marginBottom + this.paddingBottom,
            );
        }
        super.revalidate();
    }

    public destroy():void {
        super.destroy();
        if (this.cacheSurface!==undefined) this.cacheSurface.destroy();
    }

    public update():void {
        super.update();
        if (this.isDirty()) this.revalidate();
        if (this.needTextRedraw) this.redrawText();
    }

    public setAlignTextContentHorizontal(align:AlignTextContentHorizontal):void {
        if (align===this.alignTextContentHorizontal) return;
        this.alignTextContentHorizontal = align;
        this.markAsDirty();
    }

    public setWordBrake(wordBrake:WordBrake):void{
        if (this.wordBrake===wordBrake) return;
        this.wordBrake = wordBrake;
        this.markAsDirty();
    }

    public setAlignTextContentVertical(align:AlignTextContentVertical):void {
        if (align===this.alignTextContentVertical) return;
        this.alignTextContentVertical = align;
        this.markAsDirty();
    }

    public setAlignText(align:AlignText):void {
        if (align===this.alignText) return;
        this.alignText = align;
        this.markAsDirty();
    }

    public setFont(font:Font):void{
        if (font===this.font) return;
        this.font = font;
        this.markAsDirty();
    }

    public setItalicAt(i:number,italic:boolean):void {
        this.findCharImageByIndex(i).setItalic(italic);
        this.requestTextRedraw();
    }

    public setBoldAt(i:number,bold:boolean):void {
        this.findCharImageByIndex(i).setBold(bold);
        this.requestTextRedraw();
    }

    public setColorAt(i:number,col:IColor):void {
        this.findCharImageByIndex(i).setColor(col);
        this.requestTextRedraw();
    }

    protected collectAllChars():CharacterImage[] {
        const result:CharacterImage[] = [];
        for (let m:number = 0; m < this.rowSet.children.length; m++) {
            const row:TextRow = this.rowSet.children[m];
            for (let j:number = 0; j < row.children.length; j++) {
                const child:Word = row.children[j];
                for (let k:number = 0; k < child.children.length; k++) {
                    const char:CharacterImage = child.children[k];
                    result.push(char);
                }
            }
        }
        return result;
    }

    protected findCharImageByIndex(i:number):CharacterImage{
        let cnt:number = 0;
        for (let m:number = 0; m < this.rowSet.children.length; m++) {
            const row:TextRow = this.rowSet.children[m];
            for (let j:number = 0; j < row.children.length; j++) {
                const child:Word = row.children[j];
                for (let k:number = 0; k < child.children.length; k++) {
                    const char:CharacterImage = child.children[k];
                    if (cnt===i) return char;
                    cnt++;
                }
            }
        }
        return undefined!;
    }

    protected requestTextRedraw():void {
        this.needTextRedraw = true;
    }

    protected onCleared():void {
        this.requestTextRedraw();
    }

    protected _setText():void {
        this.passPropertiesToRowSet(this.rowSet);
        this.requestTextRedraw();
    }

    private calculateAutoSize():void{
        if (this.measurer===undefined) this.measurer = new TextRowSet(this.game,this.font,{width:Infinity,height:Infinity},Color.NONE);
        this.passPropertiesToRowSet(this.measurer);
        this.size.setWH(
            this.measurer.size.width + this.marginLeft + this.paddingLeft + this.marginRight + this.paddingRight,
            this.measurer.size.height + this.marginTop + this.paddingTop + this.marginBottom + this.paddingBottom,
        );
        if (this.size.width===0) this.size.width = 1;
        if (this.size.height===0) this.size.height = 1;
    }

    private passPropertiesToRowSet(rowSet:TextRowSet):void{
        rowSet.setFont(this.font);
        rowSet.setPixelPerfect(this.pixelPerfect);
        rowSet.setWordBrake(this.wordBrake);
        rowSet.setText(this._textEx);
        rowSet.setAlignText(this.alignText);
        rowSet.setAlignTextContentHorizontal(this.alignTextContentHorizontal);
        rowSet.setAlignTextContentVertical(this.alignTextContentVertical);
    }

    private redrawText():void {
        if (!this.needTextRedraw) return;
        this.rowSet.updateRowsVisibility();
        if (this.frameSkipper.willNextFrameBeSkipped()) return;
        if (this.cacheSurface!==undefined) {
            this.cacheSurface.clear();
            this.cacheSurface.drawModel(this.rowSet);
        }
        this.needTextRedraw = false;
    }

}

export class TextFieldWithoutCache extends TextField {

    public type:'TextFieldWithoutCache' = 'TextFieldWithoutCache';

    constructor(game: Game, font: Font) {
        super(game, font, false);
    }

    protected requestTextRedraw():void {
        // nothing to do
    }
}
