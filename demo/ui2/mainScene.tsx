import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {CheckBox} from "@engine/renderable/impl/ui/checkBox";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical, WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";

export class MainScene extends Scene {

    @Resource.Font('monospace',25)
    public fnt!:Font;

    public onReady() {

        this.colorBG = Color.RGB(244,244,233);

        const bg = new Rectangle(this.game);
        bg.fillColor = Color.RGBA(12,12,222, 255);
        bg.lineWidth = 1;
        bg.borderRadius = 10;

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);
        tf.size.setWH(450,300);
        tf.setBackground(bg);
        tf.textColor.setRGB(122,244,245);
        tf.setMargin(10,10);
        tf.setPadding(20,10);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
        this.appendChild(tf);

        const tf3:TextField = new ScrollableTextField(this.game,this.fnt);
        tf3.size.setWH(250,300);
        tf3.pos.setXY(460,0);
        tf3.setBackground(bg.clone());
        tf3.setMargin(10,10);
        tf3.setPadding(20,10);
        tf3.textColor.setRGB(122,200,245);
        tf3.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf3.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf3.setWordBrake(WordBrake.PREDEFINED_BREAK_LONG_WORDS);
        tf3.setText("\n" +
            "     Lorem    ipsum dolor sit amet, consectetur \n" +
            "adipiscing     elit,     sed do eiusmod tempor incididunt \n" +
            "ut labore et dolore magna aliqua. Ut enim ad minim \n" +
            "\n\n\n\n"+
            "1\n"+
            "\n"+
            "\n"+
            "1\n"+
            "Lorem ipsum dolor sit amet"
        );
        this.appendChild(tf3);

        const checkBox = new CheckBox(this.game);
        checkBox.pos.setXY(20,300);
        this.appendChild(checkBox);

        const btn = new Button(this.game,this.fnt);
        const bg2 = new Rectangle(this.game);
        bg2.fillColor = Color.RGBA(122,122,222, 255);
        bg2.lineWidth = 1;
        bg2.borderRadius = 10;
        btn.setBackground(bg2);
        btn.pos.setXY(150,300);
        btn.size.setWH(200,100);
        btn.setText("click me");
        btn.textColor.setRGB(222,144,255);
        this.appendChild(btn);

        const tf2 = new RichTextField(this.game,this.fnt);
        tf2.size.setWH(600,40);
        tf2.pos.setXY(150,430);
        tf2.setText("-==no data==-");
        this.appendChild(tf2);
        tf2.textColor.setRGB(22,44,45);
        let cnt = 0;
        const redColor:IColor = {r:255,g:100,b:100};
        const greenColor:IColor = {r:100,g:200,b:100};
        btn.on(MOUSE_EVENTS.click, e=>{
            if (checkBox.checked) cnt+=1;
            else cnt-=1;
            tf2.setRichText(
                <div>
                    clicked <font color={cnt>0?greenColor:redColor}><u>{cnt}</u></font> times
                </div>
            );
        });

    }

}
