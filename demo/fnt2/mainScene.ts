import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Font} from "@engine/renderable/impl/general/font";
import {ITexture} from "@engine/renderer/common/texture";
import {FntCreator} from "../fnt/FntCreator";
import * as fntXML from "./desyrel.xml"
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import createFont = FntCreator.createFont;

// data from https://pixijs.io/examples/#/text/bitmap-text.js

export class MainScene extends Scene {

    @Resource.Texture('./fnt2/desyrel.png')
    private sprResourceLink:ResourceLink<ITexture>;


    public onReady() {

        this.colorBG.setRGB(12,12,12);
        console.log(this.sprResourceLink,this.sprResourceLink.state);
        const fnt:Font = createFont(this.game,this.sprResourceLink,fntXML);
        console.log(fntXML);

        const tf:TextField = new TextField(this.game,fnt);
        tf.pos.setY(23);
        //tf.setFont(fnt);
        tf.textColor.setRGBA(122,0,33,0);
        tf.size.setWH(800,400);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setText("bitmap fonts \nare supported!\nWoo yay!");
        this.appendChild(tf);
    }

}
