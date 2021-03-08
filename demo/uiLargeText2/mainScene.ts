import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import * as fontXml from "xml/angelcode-loader!./font.fnt";

// https://zxpress.ru/article.php?id=8943

export class MainScene extends Scene {

    @Resource.FontFromAtlas('uiLargeText2/',fontXml)
    private fontLink:Font;

    @Resource.Text('uiLargeText2/text.txt')
    private textLink:string;


    public onReady():void {

        const tf:TextField = new ScrollableTextField(this.game,this.fontLink);
        tf.size.set(this.game.size);
        tf.setText(this.textLink);
        tf.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
        tf.setPadding(15);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setRGB(12,18,20);
        this.appendChild(tf);
    }

}
