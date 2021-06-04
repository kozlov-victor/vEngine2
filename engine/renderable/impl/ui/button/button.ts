import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font/font";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical
} from "@engine/renderable/impl/ui/textField/textAlign";

export class Button extends TextField {

    public override readonly type:string = 'Button';

    constructor(game:Game,font:Font) {
        super(game,font);
        const bg:Rectangle = new Rectangle(this.game);
        bg.lineWidth = 1;
        bg.fillColor.set(Color.NONE);
        this.setBackground(bg);

        this.setText("Ok");
        this.setAlignText(AlignText.CENTER);
        this.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        this.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        this.size.setWH(300,100);
    }

}
