import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {Color} from "@engine/renderer/common/color";
import {ITexture} from "@engine/renderer/common/texture";
import createFont = FntCreator.createFont;
import {FntCreator} from "../fnt/FntCreator";

// data from https://pixijs.io/examples/#/text/bitmap-text.js

export class MainScene extends Scene {

    private fntResourceLink:ResourceLink<string>;
    private sprResourceLink:ResourceLink<ITexture>;

    private fnt:Font;
    private tf:TextField;

    public onPreloading() {
        this.fntResourceLink = this.resourceLoader.loadText('./fnt2/desyrel.xml');
        this.sprResourceLink = this.resourceLoader.loadTexture('./fnt2/desyrel.png');
    }


    public onReady() {

        this.colorBG.setRGB(12,12,12);
        const fnt:Font = createFont(this.game,this.sprResourceLink,this.fntResourceLink);

        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        tf.setFont(fnt);
        tf.setText("bitmap fonts \nare supported!\nWoo yay!");
        this.tf = tf;
        this.appendChild(this.tf);
    }

}
