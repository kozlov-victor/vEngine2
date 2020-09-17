import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {CheckBox} from "@engine/renderable/impl/ui/toggleButton/checkBox";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Resource} from "@engine/resources/resourceDecorators";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical
} from "@engine/renderable/impl/ui/textField/textAlign";
import {RadioButton, RadioButtonGroup} from "@engine/renderable/impl/ui/toggleButton/radioButton";

const text:string=
`Lorem ipsum dolor sit amet,\t\n\r
consectetur
adipiscing elit,
sed do eiusmod
tempor incididunt ut labore et
dolore magna aliqua.
Ut enim ad minim veniam,
quis nostrud exercitation
ullamco laboris nisi ut
aliquip ex ea
commodo consequat.`;

export class MainScene extends Scene {

    @Resource.Font({fontSize:15,fontFamily:'monospace'})
    private fnt:Font;

    @Resource.Font({fontSize:17,fontFamily:'Times New Roman'})
    private fnt2:Font;


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
        chbox.on(MOUSE_EVENTS.click, e=>{
            console.log('checked',chbox.checked);
            if (chbox.checked) tf.setFont(this.fnt2);
            else tf.setFont(this.fnt);
        });
        this.appendChild(chbox);

        const radioBtn1:RadioButton = new RadioButton(this.game);
        radioBtn1.pos.setXY(130,370);
        this.appendChild(radioBtn1);

        const radioBtn2:RadioButton = new RadioButton(this.game);
        radioBtn2.pos.setXY(190,370);
        this.appendChild(radioBtn2);

        const radioBtn3:RadioButton = new RadioButton(this.game);
        radioBtn3.pos.setXY(250,370);
        this.appendChild(radioBtn3);
        radioBtn3.on(MOUSE_EVENTS.click, e=>{
            console.log(radioBtn3.checked);
        });

        const buttonGroup:RadioButtonGroup = new RadioButtonGroup();
        buttonGroup.add(radioBtn1);
        buttonGroup.add(radioBtn2);
        buttonGroup.add(radioBtn3);

        const btn:Button = new Button(this.game,this.fnt);
        btn.setText("click!");
        btn.pos.setXY(200,260);
        btn.textColor.setRGB(10,10,10);
        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 2;
        btn.setPadding(20);
        this.appendChild(btn);

    }

}
