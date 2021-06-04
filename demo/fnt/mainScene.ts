import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import * as fntXML from "xml/xml-loader!./font.fnt";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";

export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt/',fntXML)
    private font:Font;

    public override onReady():void {
        this.backgroundColor.setRGB(12,12,12);
        const tf:TextField = new TextField(this.game,this.font);
        tf.size.setWH(300,200);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.pos.setY(23);
        tf.textColor.setRGB(255);
        tf.setText("hello world\nnew string");
        this.appendChild(tf);

    }

}
