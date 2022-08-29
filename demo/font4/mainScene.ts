import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";

// demo from https://www.w3schools.com/charsets/tryit.asp?deci=129409
export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:100,chars:['🦁']})
    public readonly fnt:Font;

    public override onReady():void {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.pos.setXY(100);
        tf.setAutoSize(true);
        tf.setText("🦁");
        this.appendChild(tf);
    }


}
