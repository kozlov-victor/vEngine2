import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
} from "@engine/renderable/impl/ui/textField/textAlign";
import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";


const createRichText = ()=>{
    return (
        <div>
            <b>Lorem ipsum <i>dolor sit amet,</i>
                <font color={{r:255,g:100,b:100}}>consectetur 🥰 adipiscing elit,</font>
            </b>
            sed 🥰 do 🥰 eiusmod <u>tempor incididunt</u> ut labore et dolore magna aliqua.  eur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            2Lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit,
            <i>sed do eiusmod tempor</i> incididunt ut labore et dolore magna aliqua.
            <s>Ut enim ad minim veniam</s>, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
            <font color={{r:122,g:244,b:133}}>
                Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur.
                <font color={{r:244,g:244,b:233}}>Excepteur sint occaecat cupidatat non proident,</font>
                sunt in culpa qui officia deserunt
                mollit anim id est laborum.
            </font>
        </div>
    );
}

export class MainScene extends Scene {

    @Resource.Font('monospace',25, ['🥰'])
    private fnt:Font;

    public onReady() {

        this.colorBG = Color.RGB(244,244,233);

        const bg = new Rectangle(this.game);
        bg.fillColor = Color.RGBA(12,12,222, 255);
        bg.lineWidth = 1;
        bg.borderRadius = 10;

        const tf:RichTextField = new RichTextField(this.game,this.fnt);
        tf.size.setWH(450,300);
        tf.setBackground(bg);
        tf.textColor.setRGB(122,244,245);
        tf.setMargin(10,10);
        tf.setPadding(20,10);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.setAlignText(AlignText.JUSTIFY);
        const richText:VirtualNode = createRichText();
        //tf.setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
        tf.setRichText(richText);
        this.appendChild(tf);

    }

}
