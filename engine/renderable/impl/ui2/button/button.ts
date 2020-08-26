import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    TextField
} from "@engine/renderable/impl/ui2/textField/simple/textField";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";

export class Button extends TextField {

    revalidate() {
        this.setAlignText(AlignText.CENTER);
        this.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        this.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        if (this.size.equal(0)) {
            this.size.setWH(300,100);
            this.setText("Ok");
            this.setPadding(5);
            if (this.background===undefined) {
                const bg = new Rectangle(this.game);
                bg.lineWidth = 1;
                bg.fillColor = Color.NONE;
                this.setBackground(bg);
            }
        }
        super.revalidate();
    }

}
