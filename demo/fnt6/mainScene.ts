import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {XmlParser} from "@engine/misc/parsers/xml/xmlParser";


export class MainScene extends Scene {

    @Resource.FontFromAtlasUrl('./fnt6/','atari-smooth.xml',XmlParser)
    public readonly font:Font;

    public override onReady():void {

        this.backgroundColor.setRGB(12,12,12);

        const tf:TextField = new TextField(this.game,this.font);
        tf.pos.setXY(30);
        tf.textColor.setRGBA(122,0,33,0);
        tf.size.setWH(800,400);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setText("bitmap font \nfrom Phaser\ngame example");
        this.appendChild(tf);
    }

}
