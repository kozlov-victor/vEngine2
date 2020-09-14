import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {fontLoader} from "./FontLoader";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import loadFont = fontLoader.loadFont;


export class MainScene extends Scene {

    private fnt:Font;
    private tf:TextField;

    private fnt2:Font;
    private tf2:TextField;

    public onPreloading() {

        console.log('preloading');

        loadFont(this.game,'./fontTtf/PressStart2P.ttf','pressStart2P');
        loadFont(this.game,'./fontTtf/vintage.ttf','vintage');

        this.resourceLoader.addNextTask(()=>{
            this.fnt = new Font(this.game,{fontSize:25,fontFamily:'pressStart2P'});

            this.fnt2 = new Font(this.game,{fontSize:25,fontFamily:'vintage'});
        });


    }

    public onReady() {
        console.log('ready');

        const tf:TextField = new TextField(this.game,this.fnt);
        tf.pos.setY(23);
        tf.textColor.setRGB(0);
        this.tf = tf;

        const tf2:TextField = new TextField(this.game,this.fnt2);
        tf2.pos.setY(120);
        tf2.textColor.setRGB(0,122,0);
        this.tf2 = tf2;

        this.tf.setFont(this.fnt);
        this.tf.setText("hello world\nКирилица");

        this.tf2.setFont(this.fnt2);
        this.tf2.setText("hello world\nКирилица");
        this.tf2.filters = [new NoiseHorizontalFilter(this.game)];

        this.appendChild(this.tf);
        this.appendChild(this.tf2);

    }

}
