import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    TextField
} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Resource} from "@engine/resources/resourceDecorators";
import {ScrollableTextField} from "@engine/renderable/impl/ui2/textField/scrollable/scrollableTextField";

export class MainScene extends Scene {

    @Resource.Font('monospace',25,[244,244,245])
    public fnt!:Font;

    public onReady() {

        const bg = new Rectangle(this.game);
        bg.fillColor = Color.RGBA(12,12,222, 255);
        bg.lineWidth = 1;
        bg.borderRadius = 10;

        const tf:TextField = new ScrollableTextField(this.game,this.fnt);
        tf.size.setWH(450,300);
        tf.setBackground(bg);
        tf.setMargin(10,30);
        tf.setPadding(20,40);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
        this.appendChild(tf);

    }

}
