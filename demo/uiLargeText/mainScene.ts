import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";

// https://lukoshko.net/story/pyatachok-sovershaet-podvig.htm

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:15})
    private fnt:Font;

    @Resource.Text('uiLargeText/text.txt')
    private textLink:string;


    public override onReady():void {

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setText(this.textLink);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setPadding(15);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setRGB(12,132,255);
        this.appendChild(tf);
    }

}
