import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Resource} from "@engine/resources/resourceDecorators";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
// https://getemoji.com/

// const text:string=
// `Lorem ipsum dolor sit 📯 amet,\t\n\r
// 😀 🥰 consectetur 🖐 🩸 adipiscing elit,
// sed do eiusmod
// tempor incididunt ut labore et
// dolore magna aliqua.
// Ut enim ad minim veniam,
// quis nostrud exercitation
// ullamco laboris nisi ut
// aliquip ex ea
// commodo`;
const text =
`ab

qw
12 ui y
324
234
54
tttttttttt
y
y
y
gg`;


export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:15,extraChars:['😀','🥰','🖐','🩸','📯']})
    private fnt:Font;


    public onReady():void {

        const tf:TextField = new EditTextField(this.game,this.fnt);

        tf.pos.setXY(50,50);
        tf.size.setWH(450,120);
        //tf.setAlignText(AlignText.JUSTIFY);
        tf.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
        //tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        //tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
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
