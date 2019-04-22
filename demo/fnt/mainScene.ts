import {Scene} from "@engine/model/impl/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rect} from "@engine/geometry/rect";
import {Font, FontContext, FontFactory} from "@engine/model/impl/font";
import {TextField} from "@engine/model/impl/ui/components/textField";
import {Color} from "@engine/renderer/color";


export class MainScene extends Scene {

    private fntResourceLink:ResourceLink;
    private sprResourceLink:ResourceLink;

    private fnt:Font;
    private tf:TextField;

    onPreloading() {
        //this.fntResourceLink = this.resourceLoader.loadText('../fnt/font.fnt');
        this.sprResourceLink = this.resourceLoader.loadImage('../fnt/font.png');

        let fnt:Font = new Font(this.game);
        fnt.fontSize = 50;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(255,0,0);
        FontFactory.generate(fnt,this);
        this.fnt = fnt;
    }


    onReady() {


        this.colorBG.setRGB(250,250,250);

        const ctx:FontContext = {
            width: 320,
            height: 256,
            symbols: {
                'a': {x:232,y:202,width:8,height:38}
            }
        };
        const fnt:Font = Font.fromAtlas(this.game,this.sprResourceLink,ctx);

        const tf:TextField = new TextField(this.game);
        tf.pos.setY(23);
        tf.setFont(fnt);
        tf.setText("aa");
        this.tf = tf;
        this.appendChild(this.tf);

    }

}
