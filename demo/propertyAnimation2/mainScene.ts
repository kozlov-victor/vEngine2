import {Scene} from "@engine/scene/scene";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Color} from "@engine/renderer/common/color";
import {MoveByEllipseAnimation} from "@engine/animation/propertyAnimation/moveByEllipseAnimation";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";

export class MainScene extends Scene {

    public onReady():void {
        const model = new Circle(this.game);
        model.radius = 50;
        model.color.setRGB(2,244,34);
        model.lineWidth = 5;
        this.appendChild(model);
        model.anchorPoint.setToCenter();


        const anim1 = new MoveByEllipseAnimation(this.game);
        anim1.radiusX = 200;
        anim1.radiusY = 80;
        model.addPropertyAnimation(anim1);

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.center.set(anim1.center);
        ellipse.fillColor = Color.NONE;
        ellipse.color.setRGB(233,0,0);
        ellipse.radiusX = anim1.radiusX;
        ellipse.radiusY = anim1.radiusY;
        ellipse.lineWidth = 3;
        this.prependChild(ellipse);

    }

}
