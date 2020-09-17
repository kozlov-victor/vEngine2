import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical
} from "@engine/renderable/impl/ui/textField/textAlign";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class Button extends TextField {

    constructor(game:Game,font:Font) {
        super(game,font);
        const bg = new Rectangle(this.game);
        bg.lineWidth = 1;
        bg.fillColor.set(Color.NONE);
        this.setBackground(bg);
        this.setText("Ok");
        this.setAlignText(AlignText.CENTER);
        this.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        this.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        this.size.setWH(300,100);
        this.on(MOUSE_EVENTS.mouseDown, e=>this.onActivated(bg));
        this.on(MOUSE_EVENTS.mouseUp, e=>this.onInactivated(bg));
    }

    private onActivated(bg:Rectangle):void {
        bg.fillColor.set(Color.GREY);
    }

    private onInactivated(bg:Rectangle):void {
        bg.fillColor.set(Color.NONE);
    }

}
