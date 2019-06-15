import {Container} from "../abstract/container";
import {TextField} from "./textField";
import {Font} from "../../general/font";
import {Game} from "@engine/game";
import {DebugError} from "@engine/debug/debugError";


export class Button extends Container {

    public readonly type:string = 'Button';

    private _font:Font;
    private readonly _textField:TextField;

    constructor(game:Game) {
        super(game);
        this._textField = new TextField(game);
    }

    public revalidate():void{
        if (DEBUG && !this._font)
            throw new DebugError(`font is not set`);
        this._font.revalidate();
        if (this.children.indexOf(this._textField)===-1)
            this.appendChild(this._textField);
        super.revalidate();
        this.onGeometryChanged();
    }

    public onGeometryChanged():void{
        this._textField.onGeometryChanged();
        this.calcDrawableRect(this._textField.size.width,this._textField.size.height);
        if (this.background) {
            const dx:number = (this.background.size.width - this._textField.size.width)/2;
            const dy:number = (this.background.size.height - this._textField.size.height)/2;
            this._textField.pos.setXY(dx,dy);
        }
    }


    public setText(text:string):void{
        this._textField.setText(text);
        this._dirty = true;
    }

    public setFont(font:Font):void{
        this._font = font;
        this._textField.setFont(font);
    }

    public getText():string{
        return this._textField.getText();
    }

    public draw():boolean{
        if (this.background) this.background.draw();
        return true;
    }

}