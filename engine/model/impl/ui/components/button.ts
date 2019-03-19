import {Container} from "../generic/container";
import {TextField} from "./textField";
import {Font} from "../../font";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debugError";


export class Button extends Container {

    readonly type:string = 'Button';

    private _font:Font;
    private readonly _textField:TextField;

    constructor(game:Game) {
        super(game);
        this._textField = new TextField(game);
    }

    revalidate(){
         if (DEBUG && !this._font)
             throw new DebugError(`font is not set`);
        if (this.children.indexOf(this._textField)===-1)
            this.appendChild(this._textField);
        super.revalidate();
        this.onGeometryChanged();
    }

    onGeometryChanged(){
        this._textField.onGeometryChanged();
        this.calcDrawableRect(this._textField.width,this._textField.height);
        if (this.background) {
            let dx = (this.background.width - this._textField.width)/2;
            let dy = (this.background.height - this._textField.height)/2;

            this._textField.pos.setXY(dx,dy);
        }
    }


    setText(text:string){
        this._textField.setText(text);
        this._dirty = true;
    }

    setFont(f:Font){
        f.revalidate();
        this._font = f;
        this._textField.setFont(f);
    }

    getText(){
        return this._textField.getText();
    }

    update(){
        super.update();
    }

    draw():boolean{
        if (this.background) this.background.draw();
        return true;
    }

}