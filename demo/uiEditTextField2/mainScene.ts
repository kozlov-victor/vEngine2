import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Resource} from "@engine/resources/resourceDecorators";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import * as fntXML from "xml/xml-loader!../fnt/font.fnt";

const text =
`abaca\n
gg `;


export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt/',fntXML)
    private fnt:Font;


    public onReady():void {

        const tf:EditTextField = new EditTextField(this.game,this.fnt);
        tf.cursorColor = Color.fromCssLiteral(`#ffd8d8`);

        tf.pos.setXY(50,50);
        tf.size.setWH(700,420);
        tf.textColor.set(Color.fromCssLiteral('#0cc306'));
        const background = new Rectangle(this.game);
        background.fillColor = Color.fromCssLiteral('#03164c');
        background.borderRadius = 5;
        tf.setText(text);
        tf.setBackground(background);
        tf.setPadding(10);
        tf.setMargin(20);
        this.appendChild(tf);
        this.backgroundColor = Color.fromCssLiteral('#e0e6fc');
        document.body.style.backgroundColor = this.backgroundColor.asCSS();
    }

}
