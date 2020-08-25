import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Font('monospace',50,[255,0,0])
    private fnt:Font;

    public onReady() {
        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        tf.setFont(this.fnt);
        tf.setText("test font");
        this.appendChild(tf);
    }


}
