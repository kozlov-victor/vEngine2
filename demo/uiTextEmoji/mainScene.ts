import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {CheckBox} from "@engine/renderable/impl/ui/toggleButton/checkBox";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical
} from "@engine/renderable/impl/ui/textField/textAlign";
// https://getemoji.com/

const text:string=
`Lorem ipsum dolor sit 📯 amet,\t\n\r
😀 🥰 consectetur 🖐 🩸 adipiscing elit,
sed do eiusmod
tempor incididunt ut labore et
dolore magna aliqua.
Ut enim ad minim veniam,
quis nostrud exercitation
ullamco laboris nisi ut
aliquip ex ea
commodo`;

export class MainScene extends Scene {

    @Resource.Font({fontFamily:'monospace',fontSize:15,extraChars:['😀','🥰','🖐','🩸','📯']})
    public fnt!:Font;


    public onReady() {

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);

        tf.pos.setXY(50,50);
        tf.size.setWH(450,120);
        tf.setAlignText(AlignText.JUSTIFY);
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

        const chbox:CheckBox = new CheckBox(this.game);
        chbox.pos.setXY(50,350);
        this.appendChild(chbox);

        const btn:Button = new Button(this.game,this.fnt);
        btn.setText("click!");
        btn.pos.setXY(200,260);
        btn.textColor.setRGB(10,10,10);
        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 2;
        bg.fillColor = Color.NONE;
        btn.setBackground(bg);
        btn.setPadding(20);
        this.appendChild(btn);
        (window as any).b = btn;


    }

}
