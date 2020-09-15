import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {TextTable} from "@engine/renderable/impl/ui/textHelpers/textTable";
import {ResourceLink} from "@engine/resources/resourceLink";

export class MainScene extends Scene {

    @Resource.Font({fontSize:12,fontFamily:'monospace'})
    private fnt:Font;

    // from https://www.mockaroo.com/
    @Resource.Text('./uiPrintTable2/test.csv')
    private textLink:ResourceLink<string>;

    public onReady() {

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setAlignText(AlignText.LEFT);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setRGB(12,132,255);
        const background = new Rectangle(this.game);
        background.fillColor = Color.RGB(40);
        background.borderRadius = 5;


        tf.setText(TextTable.fromCSV(this.textLink.getTarget()).toString());
        tf.setBackground(background);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setPadding(10);
        tf.setMargin(20);
        this.appendChild(tf);

    }

}
