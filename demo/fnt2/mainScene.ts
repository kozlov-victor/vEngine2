import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Font} from "@engine/renderable/impl/general/font";
import * as fntXML from "./desyrel.xml";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";

// data from https://pixijs.io/examples/#/text/bitmap-text.js

export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt2/desyrel.png',fntXML)
    private fontLink:ResourceLink<Font>;

    public onReady():void {

        this.backgroundColor.setRGB(12,12,12);

        const tf:TextField = new TextField(this.game,this.fontLink.getTarget());
        tf.pos.setY(23);
        //tf.setFont(fnt);
        tf.textColor.setRGBA(122,0,33,0);
        tf.size.setWH(800,400);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setText("bitmap fonts \nare supported!\nWoo yay!");
        this.appendChild(tf);
    }

}
