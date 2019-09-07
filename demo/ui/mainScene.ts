import {Scene} from "@engine/core/scene";
import {TEXT_ALIGN, TextField, WORD_BRAKE} from "@engine/renderable/impl/ui/components/textField";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {CheckBox} from "@engine/renderable/impl/ui/components/checkBox";

const text:string=
`Lorem ipsum dolor sit amet, 
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

    public fnt!:Font;

    public onPreloading(){
        const fnt:Font = new Font(this.game);
        fnt.fontSize = 25;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(10);
        fnt.generate();
        this.fnt = fnt;
    }

    public onReady() {

        const tf:TextField = new TextField(this.game);
        tf.pos.setXY(10);
        tf.setFont(this.fnt);
        tf.maxHeight = 150;
        tf.maxWidth = 500;

        tf.setTextAlign(TEXT_ALIGN.JUSTIFY);
        tf.setWordBreak(WORD_BRAKE.FIT);
        tf.setText(text);

        tf.background = new Rectangle(this.game);
        tf.background.fillColor = Color.RGB(250);
        tf.setPaddings(5);
        (tf.background as Rectangle).borderRadius = 5;
        this.appendChild(tf);

        const chbox:CheckBox = new CheckBox(this.game);
        chbox.pos.setXY(50,200);
        this.appendChild(chbox);


        // const btn:Button = new Button(this.game);
        // btn.setFont(this.fnt);
        // btn.setText("click!");
        // btn.pos.setXY(50,260);
        // const bg:Rectangle = new Rectangle(this.game);
        // bg.borderRadius = 2;
        // bg.fillColor = Color.NONE;
        // btn.background = bg;
        // btn.setPaddings(20);
        // this.appendChild(btn);


    }

}
