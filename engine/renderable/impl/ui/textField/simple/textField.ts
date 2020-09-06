import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {Container} from "@engine/renderable/impl/ui/container";
import {IRectJSON} from "@engine/geometry/rect";
import {TextRowSet} from "@engine/renderable/impl/ui/textField/_internal/textRowSet";
import {MarkableNullGameObject} from "@engine/renderable/impl/ui/textField/_internal/markableNullGameObject";
import {Color} from "@engine/renderer/common/color";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical, WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";


export class TextField extends Container {

    public readonly type:string = 'TextField';
    public readonly textColor:Color = Color.RGB(122,122,122);

    protected rowSet:TextRowSet;
    protected rowSetContainer:MarkableNullGameObject = new MarkableNullGameObject(this.game);

    private cacheSurface:DrawingSurface;
    private alignTextContentVertical:AlignTextContentVertical = AlignTextContentVertical.TOP;
    private alignTextContentHorizontal:AlignTextContentHorizontal = AlignTextContentHorizontal.LEFT;
    private alignText:AlignText = AlignText.LEFT;
    private wordBrake:WordBrake = WordBrake.FIT;
    private _text:string = '';

    private needTextRedraw:boolean = false;
    private numOfSkippedFrames:number = 0;

    constructor(game:Game,private font:Font) {
        super(game);
        this.appendChild(this.rowSetContainer);
        this.size.setWH(300,100);
        this.textColor.observe(()=>this.markAsDirty());
    }

    public setText(text:string|number){
        const strText = text.toString();
        if (strText===this._text) return;
        this._text = strText;
        this.markAsDirty();
    }

    revalidate() {
        if (DEBUG && (this.size.width===0 || this.size.height===0)) {
            throw new DebugError(`can not setText: TextField size.width and/or size.height is not defined`);
        }
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
                const cacheSurface = new DrawingSurface(this.game,clientRect);
                this.rowSetContainer.replaceChild(this.cacheSurface,cacheSurface);
                this.rowSetContainer.markAsDirty();
                this.cacheSurface = cacheSurface;
            }
        }
        if (this.rowSet===undefined || rectIsDirty) this.rowSet = new TextRowSet(this.game,this.font,clientRect,this.textColor);
        this._setText();
    }

    public getText():string{
        return this._text;
    }

    public update() {
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

    protected requestTextRedraw():void {
        this.needTextRedraw = true;
    }

    protected onCleared() {
        this.requestTextRedraw();
    }

    protected _setText():void {
        this.rowSet.setFont(this.font);
        this.rowSet.setText(this._text,this.wordBrake);
        this.rowSet.setAlignText(this.alignText);
        this.rowSet.setAlignTextContentHorizontal(this.alignTextContentHorizontal);
        this.rowSet.setAlignTextContentVertical(this.alignTextContentVertical);
        this.requestTextRedraw();
    }

    private redrawText():void {
        if (!this.needTextRedraw) return;
        this.rowSet.updateRowsVisibility();
        if (this.game.fps<20) { // // wait for better times
            this.numOfSkippedFrames++;
            if (this.numOfSkippedFrames<8) return; // no better times - redraw as is
        }
        this.cacheSurface.clear();
        this.cacheSurface.drawModel(this.rowSet);
        this.needTextRedraw = false;
        this.numOfSkippedFrames = 0;
    }

}

export class TextFieldWithoutCache extends TextField {

    private readonly fnt: Font;

    constructor(game: Game, font: Font) {
        super(game, font);
        this.fnt = font;
        this.setWordBrake(WordBrake.PREDEFINED);
        this.size.setWH(16,16);
    }

    revalidate() {
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
            this.rowSet = new TextRowSet(this.game, this.fnt, clientRect, this.textColor);
            this.rowSetContainer.appendChild(this.rowSet);
        }
        this.rowSetContainer.pos.set(clientRect);
        this.rowSetContainer.size.set(clientRect);
        this._setText();
    }

}
