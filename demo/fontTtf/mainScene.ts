import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {fontLoader} from "./FontLoader";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import loadFont = fontLoader.loadFont;
import {ResourceLoader} from "@engine/resources/resourceLoader";


export class MainScene extends Scene {

    private fnt:Font;
    private tf:TextField;

    private fnt2:Font;
    private tf2:TextField;

    public onPreloading(resourceLoader:ResourceLoader):void {

        console.log('preloading');

        loadFont(this.game, resourceLoader, './fontTtf/PressStart2P.ttf', 'pressStart2P');
        loadFont(this.game, resourceLoader, './fontTtf/vintage.ttf', 'vintage');

        resourceLoader.addNextTask(async progress => {
            this.fnt = await resourceLoader.loadFontFromCssDescription({fontSize:25,fontFamily:'pressStart2P'},progress);
            this.fnt2 = await resourceLoader.loadFontFromCssDescription({fontSize:25,fontFamily:'vintage'},progress);
        });
    }

    public onReady():void {
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
