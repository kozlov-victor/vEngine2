import {Layer, LayerTransformType} from "@engine/scene/layer";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {DebugError} from "@engine/debug/debugError";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {FontContextBdfFactory} from "@engine/renderable/impl/general/font/factory/fontContextBdfFactory";
import * as bdfFontData from "../misc/data/defaultFont.json";

export class DebugLayer extends Layer {

    private textField:TextField;
    private numOfTextRows:number;
    private logs:string[] = [];

    constructor(game:Game, font?:Font) {
        super(game);
        if (!font) {
            const factory = new FontContextBdfFactory(this.game,bdfFontData);
            const fontSize = 8;
            font = factory.createFont([], [], '', fontSize)
        }
        this.transformType = LayerTransformType.STICK_TO_CAMERA;
        this.createTextField(font);
        this._parentChildDelegate.afterChildAppended =
            this._parentChildDelegate.afterChildRemoved =
            (_)=>{
                if (DEBUG) {
                    throw new DebugError(`DebugLayer: can not append or remove child. It allowed for internal usage only`)
                }
            }
    }

    private createTextField(font:Font):void {
        const textField = new TextField(this.game,font);
        textField.size.setFrom(this.game.size);
        textField.setPadding(5);
        textField.textColor.setRGB(0);
        this.numOfTextRows = ~~(textField.getClientRect().height / font.context.lineHeight);
        textField.setWordBrake(WordBrake.PREDEFINED);
        this.appendChild(textField);
        this.textField = textField;
    }

    public log(...args:any[]):void {
        args.forEach((txt:any)=>{
            if (txt===undefined) txt = 'undefined';
            else if (txt===null) txt = 'null';
            else if ('HTMLElement' in window && txt instanceof HTMLElement) {
                txt = `[object ${txt.tagName}]`;
            }
            else if (txt.toJSON) {
                txt = JSON.stringify(txt.toJSON(),undefined,4);
            }
            else if (typeof txt==='function') {
                txt = txt.toString();
            }
            else if (!(txt as string).substr) {
                try {
                    txt = JSON.stringify(txt, undefined, 4);
                } catch (e){
                    if (txt.constructor && txt.constructor.name) txt = `[object ${txt.constructor.name}]`;
                    else txt = txt.toString();
                }
            }
            this.logs.push(...txt.split('\n'));
        });
        this.logs = this.logs.slice(-this.numOfTextRows);
        const textToSet = this.logs.join('\n');
        this.textField.setText(textToSet);
    }

    public clearLog():void {
        this.logs.length = 0;
        this.textField.setText('');
    }

    public println(...args:any[]):void {
        this.clearLog();
        this.log(...args);
    }

    public getTextField():TextField {
        return this.textField;
    }

    public setSolidBackground():void {
        const rect = new Rectangle(this.game);
        rect.fillColor = Color.WHITE;
        this.textField.setBackground(rect);
        this.textField.setAutoSize(true);
    }


    public override render() {
        const renderingStackEnabled = this.getParent()._renderingSessionInfo.drawingStackEnabled;
        this.getParent()._renderingSessionInfo.drawingStackEnabled = false;
        super.render();
        this.getParent()._renderingSessionInfo.drawingStackEnabled = renderingStackEnabled;
    }
}
