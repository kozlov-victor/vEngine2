import {Scene} from "@engine/model/impl/scene";
import {TEXT_ALIGN, TextField} from "@engine/model/impl/ui/components/textField";
import {Font} from "@engine/model/impl/font";
import {Color} from "@engine/renderer/color";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {FntCreator} from "../fnt/FntCreator";
import createFont = FntCreator.createFont;

const text:string=
`Lorem ipsum dolor sit amet, 
consectetur adipiscing elit, 
sed do eiusmod tempor incididunt 
ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, 
quis nostrud exercitation 
ullamco laboris nisi ut 
aliquip ex ea 
commodo consequat.`;

export class MainScene extends Scene {

    fnt:Font;


    onPreloading(){
        let fnt:Font = new Font(this.game);
        fnt.fontSize = 25;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(255,255,200);
        fnt.generate();
        this.fnt = fnt;
    }

    onReady() {

        const tf:TextField = new TextField(this.game);
        tf.setFont(this.fnt);
        tf.maxHeight = 150;
        tf.maxWidth = 600;

        tf.textAlign = TEXT_ALIGN.CENTER;
        tf.setText(text);

        tf.background = new Rectangle(this.game);
        tf.background.color = Color.RGB(10,10,10,100);
        tf.setPaddings(5);
        (tf.background as Rectangle).borderRadius = 5;
        this.appendChild(tf);

        (window as any).tf = tf;

    }

}
