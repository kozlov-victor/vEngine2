import {Layer, LayerTransformType} from "@engine/scene/layer";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {TaskQueue} from "@engine/resources/taskQueue";

export class DebugLayer extends Layer {

    private textField:TextField;
    private font:Font;
    private numOfTextRows:number;
    private logs:string[] = [];

    constructor(game:Game) {
        super(game);
        this.transformType = LayerTransformType.STICK_TO_CAMERA;
        this.loadFont();
    }

    private loadFont():void {
        (async () => {
            const queue:TaskQueue = new TaskQueue(this.game);
            this.font = await queue.getLoader().loadFontFromCssDescription({fontFamily: 'monospace',fontSize: 14});
            const textField = new TextField(this.game,this.font);
            textField.size.set(this.game.size);
            textField.setPadding(5);
            textField.textColor.setRGB(0);
            this.numOfTextRows = ~~(textField.getClientRect().height / this.font.context.lineHeight);
            textField.setWordBrake(WordBrake.PREDEFINED);
            this.appendChild(textField);
            textField.passMouseEventsThrough = true;
            this.textField = textField;
        })();
    }

    public log(...args:any[]):void {
        // eslint-disable-next-line prefer-rest-params
        Array.prototype.slice.call(arguments).forEach((txt:any,i:number)=>{
            if (txt===undefined) txt = 'undefined';
            else if (txt===null) txt = 'null';
            else if (txt instanceof HTMLElement) {
                txt = `[object ${txt.tagName}]`;
            }
            else if (txt.toJSON) {
                txt = JSON.stringify(txt.toJSON(),undefined,4);
            }
            else if (typeof txt==='function') {
                txt = txt.toString();
            }
            else {
                if (!(txt as string).substr) {
                    try{
                        txt = JSON.stringify(txt);
                    } catch (e){
                        if (txt.constructor && txt.constructor.name) txt = `[object ${txt.constructor.name}]`;
                        else txt = txt.toString();
                    }
                }
            }
            this.logs.push(...txt.split('\n'));
        });
        if (this.textField!==undefined)  {
            this.logs = this.logs.slice(-this.numOfTextRows);
            const textToSet:string = (this.logs.join('\n'));
            this.textField.setText(textToSet);
        }
    }

    public clearLog():void {
        this.logs.length = 0;
        if (this.textField!==undefined) {
            this.textField.setText('');
        }
    }

}
