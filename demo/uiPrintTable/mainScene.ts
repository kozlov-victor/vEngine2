import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {TextTable} from "@engine/renderable/impl/ui/textHelpers/textTable";

//declare const COLOR:(arg:TemplateStringsArray)=>Color;

export class MainScene extends Scene {

    @Resource.Font({fontSize:15,fontFamily:'monospace'})
    private fnt:Font;

    public onReady() {

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);
        tf.size.set(this.game.size);
        tf.setAlignText(AlignText.LEFT);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.TOP);
        tf.textColor.setRGB(12,132,255);
        const background = new Rectangle(this.game);
        background.fillColor = Color.RGB(40);
        background.borderRadius = 5;

        // example from https://github.com/photonstorm/phaser-examples/blob/master/examples/text/text%20tabs%20from%20array.js
        const swords = [
            [ 'Knife', '1d3', '1', ''],
            [ 'Dagger', '1d4', '1', 'May be thrown' ],
            [ 'Rapier', '1d6', '2', 'Max strength damage bonus +1' ],
            [ 'Sabre', '1d6', '3', 'Max strength damage bonus +3' ],
            [ 'Cutlass', '1d6', '5', '' ],
            [ 'Scimitar', '2d4', '4', '' ],
            [ 'Long Sword', '1d8+1', '6', '' ],
            [ 'Bastard Sword', '1d10+1', '8', 'Requires 2 hands to use effectively' ],
            [ 'Great Sword', '1d12+1', '10', 'Must always be used with 2 hands']
        ];
        tf.setText(TextTable.fromArrays(swords,{align: AlignTextContentHorizontal.CENTER,border:true}).toString());
        tf.setBackground(background);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setPadding(10);
        tf.setMargin(20);
        this.appendChild(tf);

    }

}
