import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    TextField,
    WordBrake
} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {ScrollableTextField} from "@engine/renderable/impl/ui2/textField/scrollable/scrollableTextField";
import {Resource} from "@engine/resources/resourceDecorators";
import {ResourceLink} from "@engine/resources/resourceLink";


export class MainScene extends Scene {

    @Resource.Font('monospace',15)
    private fnt!:Font;

    @Resource.Text('uiLargeText/text.txt')
    private textLink:ResourceLink<string>;


    public onReady() {

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);
        tf.size.setWH(this.game.size.width,400);
        tf.setText(this.textLink.getTarget());
        tf.setWordBrake(WordBrake.FIT);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setRGB(12,132,255);
        this.appendChild(tf);
    }

}
