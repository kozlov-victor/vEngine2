import {Scene} from "@engine/model/impl/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Font} from "@engine/model/impl/font";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {Color} from "@engine/renderer/color";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {FntCreator} from "./FntCreator";
import createFont = FntCreator.createFont;


export class MainScene extends Scene {

    private fntResourceLink:ResourceLink<string>;
    private sprResourceLink:ResourceLink<Texture>;

    private fnt:Font;
    private tf:TextField;

    public onPreloading() {
        this.fntResourceLink = this.resourceLoader.loadText('../fnt/font.fnt');
        this.sprResourceLink = this.resourceLoader.loadImage('../fnt/font.png');

        const fnt:Font = new Font(this.game);
        fnt.fontSize = 50;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(255,0,0);
        this.fnt = fnt;
    }


    public onReady() {


        this.colorBG.setRGB(12,12,12);
        const fnt:Font = createFont(this.game,this.sprResourceLink,this.fntResourceLink);

        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        tf.setFont(fnt);
        tf.setText("hello world\nnew string");
        this.tf = tf;
        this.appendChild(this.tf);

    }

}
