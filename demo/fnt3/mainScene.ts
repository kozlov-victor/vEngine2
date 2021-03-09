import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import * as fntXML from "xml/angelcode-loader!./font.fnt";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";

export class MainScene extends Scene {


    // created with http://kvazars.com/littera/
    @Resource.FontFromAtlas('./fnt3',fntXML)
    private font:Font;


    public onReady():void {
        this.backgroundColor.setRGB(12,12,12);
        const tf:TextField = new TextField(this.game,this.font);
        tf.size.set(this.game.size);
        tf.setPadding(10);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.textColor.setRGBA(0,0,0,0);
        tf.setText("hello world\nnew string\ncreated with kvazars.com/littera/");
        this.appendChild(tf);

    }

}
