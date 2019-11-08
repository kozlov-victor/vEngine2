import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {Color} from "@engine/renderer/common/color";
import {fontLoader} from "../fontTtf/FontLoader";
import loadFont = fontLoader.loadFont;


export class MainScene extends Scene {

    private fnt:Font;
    private tf:TextField;

    public onPreloading() {

        loadFont(this.game,'./fontTtf2/zx.ttf','zx');

        this.fnt = new Font(this.game);
        this.fnt.fontSize = 30;
        this.fnt.fontFamily = 'zx';
        this.fnt.fontColor = Color.BLACK;


        this.resourceLoader.addNextTask(()=>{
            this.fnt.generate();
            console.log('font generated',this.fnt);
        });


        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        this.tf = tf;

    }

    public onReady() {
        console.log('ready');
        // this.colorBG.setRGB(12,12,12);
        this.tf.setFont(this.fnt);
        this.tf.setText("zx spectrum font\nКирилица");

        this.appendChild(this.tf);

    }

}
