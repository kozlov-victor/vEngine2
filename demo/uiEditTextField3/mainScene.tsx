import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Resource} from "@engine/resources/resourceDecorators";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import * as fntXML from "xml/angelcode-loader!./font/pressStartToPlay.fnt";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical
} from "@engine/renderable/impl/ui/textField/textAlign";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {

    @Resource.FontFromAtlas('./uiEditTextField3/font/',fntXML)
    public readonly fnt:Font;


    public override onReady():void {

        const tf:EditTextField = new EditTextField(this.game,this.fnt);
        tf.cursorColor = ColorFactory.fromCSS(`#ffd8d8`);

        tf.pos.setXY(50,50);
        tf.size.setWH(700,420);
        tf.textColor.setFrom(ColorFactory.fromCSS('#0cc306'));
        const background = new Rectangle(this.game);
        background.fillColor = ColorFactory.fromCSS('#03164c');
        background.borderRadius = 5;
        tf.setRichText(
            <>
                zx spectrum-like font {'\n'}
                <v_font size={30}>load ""</v_font>
            </>
        );
        tf.setBackground(background);
        tf.setPadding(10);
        tf.setMargin(20);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignText(AlignText.CENTER);
        this.appendChild(tf);
        this.backgroundColor = ColorFactory.fromCSS('#e0e6fc');
        document.body.style.backgroundColor = this.backgroundColor.asCssRgba();
    }

}
