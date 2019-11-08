import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {fontLoader} from "./FontLoader";
import {Color} from "@engine/renderer/common/color";
import loadFont = fontLoader.loadFont;


export class MainScene extends Scene {

    private fnt:Font;
    private tf:TextField;

    private fnt2:Font;
    private tf2:TextField;

    public onPreloading() {

        loadFont(this.game,'./fontTtf/PressStart2P.ttf','pressStart2P');
        loadFont(this.game,'./fontTtf/vintage.ttf','vintage');

        this.fnt = new Font(this.game);
        this.fnt.fontSize = 25;
        this.fnt.fontFamily = 'pressStart2P';
        this.fnt.fontColor = Color.BLACK.clone();

        this.fnt2 = new Font(this.game);
        this.fnt2.fontSize = 25;
        this.fnt2.fontFamily = 'vintage';
        this.fnt2.fontColor = Color.BLACK.clone();

        this.resourceLoader.addNextTask(()=>{
            this.fnt.generate();
            console.log('font generated');
        });

        this.resourceLoader.addNextTask(()=>{
            this.fnt2.generate();
            console.log('font2 generated');
        });

        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        this.tf = tf;

        const tf2:TextField = new TextField(this.game);
        tf2.pos.setY(120);
        this.tf2 = tf2;
    }

    public onReady() {
        console.log('ready');
        // this.colorBG.setRGB(12,12,12);
        this.tf.setFont(this.fnt);
        this.tf.setText("hello world\nКирилица");


        this.tf2.setFont(this.fnt2);
        this.tf2.setText("hello world\nКирилица");

        this.appendChild(this.tf);
        this.appendChild(this.tf2);

    }

}
