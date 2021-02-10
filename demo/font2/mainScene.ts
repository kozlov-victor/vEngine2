import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";


export class MainScene extends Scene {

    @Resource.Font({fontFamily:'monospace',fontSize:50})
    private fnt:Font;

    public onReady():void {
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.pos.setY(23);
        tf.textColor.setRGB(255,0,0);
        tf.setText("test font");
        this.appendChild(tf);
    }

}
