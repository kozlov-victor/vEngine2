import {Scene} from "@engine/model/impl/scene";
import {Font} from "@engine/model/impl/font";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {fontLoader} from "./FontLoader";
import {Color} from "@engine/renderer/color";
import loadFont = fontLoader.loadFont;


export class MainScene extends Scene {

    private fnt:Font;
    private tf:TextField;

    onPreloading() {

        loadFont(this.game,'PressStart2P.ttf');

        this.fnt = new Font(this.game);
        this.fnt.fontSize = 25;
        this.fnt.fontFamily = 'customFont';
        this.fnt.fontColor = Color.BLACK.clone();

        this.resourceLoader.addNextTask(()=>{
            this.fnt.generate();
            console.log('font generated');
        });

        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        this.tf = tf;
    }

    onReady() {
        console.log('ready');
        //this.colorBG.setRGB(12,12,12);
        this.tf.setFont(this.fnt);
        this.tf.setText("hello world\nКирилица");
        this.appendChild(this.tf);

    }

}
