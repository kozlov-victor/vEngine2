import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {DebugError} from "@engine/debug/debugError";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Container} from "@engine/renderable/impl/ui2/container";
import {IRectJSON} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {TextRowSet} from "@engine/renderable/impl/ui2/textField/_internal/textRowSet";


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

export const enum WORD_BRAKE {
    PREDEFINED,
    FIT
}

export class TextField extends Container {

    protected rowSet:TextRowSet;
    protected rowSetContainer:RenderableModel = new NullGameObject(this.game);
    private alignTextContentVertical:AlignTextContentVertical = AlignTextContentVertical.TOP;
    private alignTextContentHorizontal:AlignTextContentHorizontal = AlignTextContentHorizontal.LEFT;
    private alignText:AlignText = AlignText.LEFT;
    private _ready:boolean = false;

    constructor(game:Game,private font:Font) {
        super(game);
    }

    public setText(text:string){
        if (DEBUG && this.size.width===0) {
            throw new DebugError(`can not setText: TextField size.width is not defined`);
        }
        this.prepare();
        this.rowSet.setText(text);
        this.setAlignTextContentHorizontal(this.alignTextContentHorizontal);
        this.setAlignTextContentVertical(this.alignTextContentVertical);
        this.setAlignText(this.alignText);
    }

    public setAlignTextContentHorizontal(align:AlignTextContentHorizontal):void {
        this.alignTextContentHorizontal = align;
        if (this.rowSet!==undefined) this.rowSet.setAlignTextContentHorizontal(align);
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
        if (this._ready) return;
        this.revalidate();
        const clientRect:Readonly<IRectJSON> = this.getClientRect();
        this.appendChild(this.rowSetContainer);
        this.rowSetContainer.pos.setXY(clientRect.x,clientRect.y);
        this.rowSetContainer.size.set(clientRect);
        this.rowSet = new TextRowSet(this.game,this.font,clientRect.width,clientRect.height);
        this.rowSetContainer.appendChild(this.rowSet);
        this._ready = true;
    }

}
