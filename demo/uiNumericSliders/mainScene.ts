import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {HorizontalNumericSlider} from "@engine/renderable/impl/ui/numericSlider/horizontalNumericSlider";
import {VerticalNumericSlider} from "@engine/renderable/impl/ui/numericSlider/verticalNumericSlider";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {MathEx} from "@engine/misc/math/mathEx";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {


    public override onReady():void {
        this.backgroundColor = ColorFactory.fromCSS(`#efefef`);

        const h:HorizontalNumericSlider = new HorizontalNumericSlider(this.game);
        h.pos.setXY(50,50);
        h.size.setWH(300,50);
        h.setPadding(5);
        this.appendChild(h);

        const v:VerticalNumericSlider = new VerticalNumericSlider(this.game);
        v.pos.setXY(50,120);
        v.size.setWH(50,300);
        v.setPadding(1);
        this.appendChild(v);

        const verticalHandler = new Rectangle(this.game);
        verticalHandler.borderRadius = 5;
        verticalHandler.fillColor = ColorFactory.fromCSS(`#96b8fa`);
        v.setBackgroundHandler(verticalHandler);

        const verticalBg = new Rectangle(this.game);
        const grad = new LinearGradient();
        verticalBg.borderRadius = 5;
        grad.setColorAtPosition(0,ColorFactory.fromCSS(`#cd0a0a`));
        grad.setColorAtPosition(0.6,ColorFactory.fromCSS(`#215126`));
        grad.angle = MathEx.degToRad(-90);
        verticalBg.fillGradient = grad;
        v.setBackground(verticalBg);

    }

}
