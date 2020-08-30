import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {Container} from "@engine/renderable/impl/ui2/container";
import {IRectJSON} from "@engine/geometry/rect";
import {TextRowSet} from "@engine/renderable/impl/ui2/textField/_internal/textRowSet";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {MarkableNullGameObject} from "@engine/renderable/impl/ui2/textField/_internal/markableNullGameObject";
import {Color} from "@engine/renderer/common/color";


export enum AlignTextContentVertical {
    TOP,
    CENTER,
    BOTTOM,
}

export enum AlignTextContentHorizontal {
    LEFT,
    CENTER,
    RIGHT,
}

export enum AlignText {
    LEFT,
    CENTER,
    RIGHT,
    JUSTIFY,
}

export const enum WordBrake {
    PREDEFINED,
    FIT
}

export class TextField extends Container {

    public readonly type:string = 'TextField';
    public textColor:Color = Color.RGB(122,122,122);

    protected rowSet:TextRowSet;
    protected rowSetContainer:MarkableNullGameObject = new MarkableNullGameObject(this.game);

    private cacheSurface:DrawingSurface;
    private alignTextContentVertical:AlignTextContentVertical = AlignTextContentVertical.TOP;
    private alignTextContentHorizontal:AlignTextContentHorizontal = AlignTextContentHorizontal.LEFT;
    private alignText:AlignText = AlignText.LEFT;
    private wordBrake:WordBrake = WordBrake.FIT;
    private _text:string = '';

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
    }

    public setAlignTextContentHorizontal(align:AlignTextContentHorizontal):void {
        this.alignTextContentHorizontal = align;
        this.markAsDirty();
    }

    public setWordBrake(wordBrake:WordBrake):void{
        if (this.wordBrake===wordBrake) return;
        this.wordBrake = wordBrake;
        this.markAsDirty();
    }

    public setAlignTextContentVertical(align:AlignTextContentVertical):void {
        this.alignTextContentVertical = align;
        this.markAsDirty();
    }

    public setAlignText(align:AlignText):void {
        this.alignText = align;
        this.markAsDirty();
    }

    protected redrawText():void {
        this.rowSet.updateRowsVisibility();
        this.cacheSurface.clear();
        this.cacheSurface.drawModel(this.rowSet);
    }

    protected onCleared() {
        this.redrawText();
    }

    private _setText():void {
        this.rowSet.setText(this._text,this.wordBrake);
        this.rowSet.setAlignText(this.alignText);
        this.rowSet.setAlignTextContentHorizontal(this.alignTextContentHorizontal);
        this.rowSet.setAlignTextContentVertical(this.alignTextContentVertical);
        this.redrawText();
    }

}
