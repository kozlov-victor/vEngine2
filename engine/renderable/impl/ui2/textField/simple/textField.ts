import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Container} from "@engine/renderable/impl/ui2/container";
import {IRectJSON} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {TextRowSet} from "@engine/renderable/impl/ui2/textField/_internal/textRowSet";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";


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

    protected rowSet:TextRowSet;
    protected rowSetContainer:RenderableModel = new NullGameObject(this.game);

    private cacheSurface:DrawingSurface;
    private alignTextContentVertical:AlignTextContentVertical = AlignTextContentVertical.TOP;
    private alignTextContentHorizontal:AlignTextContentHorizontal = AlignTextContentHorizontal.LEFT;
    private alignText:AlignText = AlignText.LEFT;
    private wordBrake:WordBrake = WordBrake.FIT;
    private _ready:boolean = false;
    private _text:string;

    constructor(game:Game,private font:Font) {
        super(game);
    }

    public setText(text:string|number){
        if (this._text===text) return;
        const strText:string = text.toString();
        this._text = strText;
        if (DEBUG && (this.size.width===0 || this.size.height===0)) {
            throw new DebugError(`can not setText: TextField size.width and/or size.height is not defined`);
        }
        if (!this._ready) this.prepare();
        this.rowSet.setText(strText,this.wordBrake);
        this.setAlignTextContentHorizontal(this.alignTextContentHorizontal);
        this.setAlignTextContentVertical(this.alignTextContentVertical);
        this.setAlignText(this.alignText);
        this.redrawText();
    }

    public getText():string{
        return this._text;
    }

    public setAlignTextContentHorizontal(align:AlignTextContentHorizontal):void {
        this.alignTextContentHorizontal = align;
        if (this.rowSet!==undefined) this.rowSet.setAlignTextContentHorizontal(align);
    }

    public setWordBrake(wordBrake:WordBrake):void{
        if (this.wordBrake===wordBrake) return;
        this.wordBrake = wordBrake;
        this.setText(this._text);
    }

    public setAlignTextContentVertical(align:AlignTextContentVertical):void {
        this.alignTextContentVertical = align;
        if (this.rowSet!==undefined) this.rowSet.setAlignTextContentVertical(align);
    }

    public setAlignText(align:AlignText):void {
        this.alignText = align;
        if (this.rowSet!==undefined) this.rowSet.setAlignText(align);
    }

    protected prepare():void {
        this.revalidate();
        const clientRect:Readonly<IRectJSON> = this.getClientRect();
        this.appendChild(this.rowSetContainer);
        this.rowSetContainer.pos.setXY(clientRect.x,clientRect.y);
        this.rowSetContainer.size.set(clientRect);
        this.rowSet = new TextRowSet(this.game,this.font,clientRect.width,clientRect.height);

        //this.rowSetContainer.appendChild(this.rowSet);
        this.cacheSurface = new DrawingSurface(this.game,clientRect);
        this.rowSetContainer.appendChild(this.cacheSurface);

        this._ready = true;
    }

    protected redrawText():void {
        this.rowSet.updateRowsVisibility();

        //
        this.cacheSurface.clear();
        this.cacheSurface.drawModel(this.rowSet);
    }

}
