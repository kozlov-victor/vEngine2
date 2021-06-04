import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";

const text:string=
`Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et
dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation
ullamco laboris nisi ut
aliquip ex ea
commodo consequat.`;

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize:20,fontFamily:'monospace'})
    private fnt:Font;


    public override onReady():void {

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);

        tf.pos.setXY(50,50);
        tf.size.setWH(450,120);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setRGB(12,132,255);
        const background = new Rectangle(this.game);
        background.fillColor = Color.RGB(40);
        background.borderRadius = 5;
        tf.setText(text);
        tf.setBackground(background);
        tf.setPadding(10);
        tf.setMargin(20);
        this.appendChild(tf);

    }

}
