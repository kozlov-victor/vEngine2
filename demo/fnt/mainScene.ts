import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Font} from "@engine/renderable/impl/general/font";
import {FntCreator} from "./FntCreator";
import {ITexture} from "@engine/renderer/common/texture";
import * as fntXML from "./font.fnt"
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui2/textField/textAlign";
import createFont = FntCreator.createFont;

export class MainScene extends Scene {

    @Resource.Texture('./fnt/font.png')
    private sprResourceLink:ResourceLink<ITexture>;


    public onReady() {

        this.colorBG.setRGB(12,12,12);
        const fnt:Font = createFont(this.game,this.sprResourceLink,fntXML);

        const tf:TextField = new TextField(this.game,fnt);
        tf.size.setWH(300,200);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.pos.setY(23);
        tf.setFont(fnt);
        tf.textColor.setRGB(255);
        tf.setText("hello world\nnew string");
        this.appendChild(tf);

    }

}
