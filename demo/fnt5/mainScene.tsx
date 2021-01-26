import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import * as fntXML1 from "xml/angelcode-loader!../fnt4/font.fnt";
import * as fntXML2 from "xml/angelcode-loader!../fnt3/font.fnt";
import * as fntXML3 from "xml/xml-loader!../fnt/font.fnt";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {ResourceLink} from "@engine/resources/resourceLink";
import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt4/font.png',fntXML1)
    private fontLink1:ResourceLink<Font>;

    @Resource.FontFromAtlas('./fnt3/font.png',fntXML2)
    private fontLink2:ResourceLink<Font>;

    @Resource.FontFromAtlas('./fnt/font.png',fntXML3)
    private fontLink3:ResourceLink<Font>;

    public onReady():void {
        this.backgroundColor.setRGB(12,12,12);
        const tf:RichTextField = new RichTextField(this.game,this.fontLink1.getTarget());
        tf.size.set(this.game.size);
        tf.setPadding(10);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.textColor.setRGB(255,255,255);
        let cnt:number = 0;
        tf.on(MOUSE_EVENTS.click, _=>{
            tf.setRichText(
                <div>
                    <u><v_font color={{r:255,g:122,b:122}}>Киррилический</v_font> <v_font color={{r:100,g:255,b:255}}>шрифт</v_font></u>
                    {'\n'}
                    <b>Новая</b> строка 1
                    {'\n'}
                    <v_font size={10} color={{r:122,g:255,b:122}}><b>Новая</b> строка 2</v_font>
                    {'\n'}
                    <b>Новая</b> строка 3 <v_font font={this.fontLink3.getTarget()} color={{r:122,g:255,b:122}}>(another font)</v_font>
                    {'\n'}
                    Счетчик <v_font size={80} color={{r:200,g:200,b:122}} font={this.fontLink2.getTarget()}>{++cnt}</v_font>
                    {'\n'}
                    <v_font color={{r:122,g:122,b:122}} size={25}>(Кликнуть для инкремента)</v_font>
                    {'\n'}
                    <v_font font={this.fontLink2.getTarget()} color={{r:122,g:255,b:122}} size={71}>Эта <i>строка</i> с <s>тем же</s> <u>другим</u> шрифтом</v_font>
                    {'\n'}
                    Новая строка с <s>другим</s> <u>тем же</u> шрифтом
                </div>
            );
        });
        tf.setText('Кликнуть');
        this.appendChild(tf);

    }

}
