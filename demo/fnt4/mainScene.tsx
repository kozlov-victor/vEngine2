import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import * as fntXML from "xml/angelcode-loader!./font.fnt";
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


    // created with http://kvazars.com/littera/
    @Resource.FontFromAtlas('./fnt4/',fntXML)
    private font:Font;


    public override onReady():void {
        this.backgroundColor.setRGB(12,12,12);
        const tf:RichTextField = new RichTextField(this.game,this.font);
        tf.size.set(this.game.size);
        tf.setPadding(10);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.textColor.setRGB(255,255,255);
        let cnt:number = 0;
        tf.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            tf.setRichText(
                <div>
                    <v_font color={{r:255,g:122,b:122}}><u>К</u>иррилический</v_font> <v_font color={{r:100,g:255,b:255}}>шрифт</v_font>
                    {'\n'}
                    <b>Новая</b> строка 1
                    {'\n'}
                    <v_font size={15} color={{r:122,g:255,b:122}}><b>Новая</b> строка 2</v_font>
                    {'\n'}
                    <b>Новая</b> строка 3
                    {'\n'}
                    Счетчик <v_font size={50} color={{r:200,g:200,b:122}}>{++cnt}</v_font>
                    {'\n'}
                    <v_font color={{r:122,g:122,b:122}} size={25}>(Кликнуть для инкремента)</v_font>
                </div>
            );
        });
        tf.setText('Кликнуть');
        this.appendChild(tf);

    }

}
