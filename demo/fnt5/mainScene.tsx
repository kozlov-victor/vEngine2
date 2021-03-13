import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
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
import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt4',fntXML1)
    private font1:Font;


    @Resource.FontFromAtlas('./fnt',fntXML3)
    private font3:Font;

    public onReady():void {
        this.backgroundColor.setRGB(12,12,12);
        const tf:RichTextField = new RichTextField(this.game,this.font1);
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
                    <v_font font={this.font3} size={10} color={{r:122,g:255,b:122}}><b>Новая</b> строка 2</v_font>
                    <v_font font={this.font3} size={10}>{'\n'}</v_font>
                    <b>Новая</b> строка 3 <v_font color={{r:122,g:255,b:122}}>(another font)</v_font>
                    {'\n'}
                    Счетчик <v_font size={80} color={{r:200,g:200,b:122}}>{++cnt}</v_font>
                    {'\n'}
                    <v_font color={{r:122,g:122,b:122}} size={25}>(Кликнуть для инкремента)</v_font>
                    {'\n'}
                    <v_font font={this.font3} color={{r:122,g:255,b:122}} size={41}>This is <i>string</i> with <s> the same</s> <u>another</u> font</v_font>
                    {'\n'}
                    Новая строка
                    {'\n'}
                    с <s>другим</s> <u>тем же</u> шрифтом
                </div>
            );
        });
        tf.setText('Кликнуть');
        this.appendChild(tf);

    }

}
