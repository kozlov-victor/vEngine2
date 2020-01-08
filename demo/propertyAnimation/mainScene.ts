import {Scene} from "@engine/scene/scene";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Color} from "@engine/renderer/common/color";
import {MoveByCircleAnimation} from "@engine/animation/propertyAnimation/moveByCircleAnimation";

export class MainScene extends Scene {

    public onReady() {
        const model = new Circle(this.game);
        model.radius = 50;
        model.color.setRGB(2,244,34);
        model.lineWidth = 5;
        this.appendChild(model);
        model.anchor.setToCenter();


        const anim1 = new MoveByCircleAnimation(this.game);
        anim1.radius = 200;
        this.addPropertyAnimation(anim1);

        const circle:Circle = new Circle(this.game);
        circle.center.set(anim1.center);
        circle.fillColor = Color.NONE;
        circle.color.setRGB(233,0,0);
        circle.radius = anim1.radius;
        circle.lineWidth = 3;
        this.prependChild(circle);

        anim1.onProgress((p)=>{
            model.pos.set(p);
        });

    }

}
