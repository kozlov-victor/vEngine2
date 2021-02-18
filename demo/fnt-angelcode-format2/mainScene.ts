import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Font} from "@engine/renderable/impl/general/font";
import * as fntXML from "xml/angelcode-loader!./test_font.fnt";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";


export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt-angelcode-format2/test_font_0.png',fntXML)
    private font:Font;

    public onReady():void {

        this.backgroundColor.setRGB(12,12,12);

        const tf:TextField = new TextField(this.game,this.font);
        tf.size.setWH(300,200);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.pos.setY(23);
        tf.setPadding(5);
        tf.textColor.setRGB(255);
        tf.setText("hello world\nnew string\nКириллица!");
        this.appendChild(tf);

    }

}
