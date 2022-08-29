import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font/font";
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
        <>
            <b>
                <u>L</u>orem ipsum <i>dolor sit amet,</i>
                <v_font color={{r:255,g:100,b:100}}>consectetur 🥰 adipiscing elit,</v_font>
            </b>
            sed 🥰 do 🥰 eiusmod <u>tempor incididunt</u> ut labore et dolore magna aliqua.  eur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            2Lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit,
            <i>sed do eiusmod tempor</i> incididunt <v_font size={35}>ut labore et <u>dolore</u> magna aliqua.</v_font>
            <s>Ut enim ad minim veniam</s>, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
            <v_font color={{r:122,g:244,b:133}} size={12}>
                Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur.
                <v_font color={{r:244,g:244,b:233}}>Excepteur sint occaecat cupidatat non proident,</v_font>
                sunt in culpa qui officia deserunt
                mollit anim id est laborum. 3Lorem ipsum <u>dolor</u> sit amet, consectetur adipiscing elit
            </v_font>
        </>
    );
};

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize:25,fontFamily:'monospace',extraChars:['🥰']})
    public readonly fnt:Font;

    public override onReady():void {

        this.backgroundColor = Color.RGB(244,244,233);

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
