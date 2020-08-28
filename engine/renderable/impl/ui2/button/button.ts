import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    TextField
} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";

export class Button extends TextField {

    constructor(game:Game,font:Font) {
        super(game,font);
        const bg = new Rectangle(this.game);
        bg.lineWidth = 1;
        bg.fillColor = Color.NONE;
        this.setBackground(bg);
        this.setText("Ok");
        this.setAlignText(AlignText.CENTER);
        this.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        this.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        this.size.setWH(300,100);
    }

}
