import {Scene} from "@engine/scene/scene";
import {MoveByPathAnimation} from "@engine/animation/propertyAnimation/moveByPathAnimation";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {

    public onReady() {
        // reference http://localhost:63342/vEngine2/demo/propertyAnimation6/ref.html
        const model = new Rectangle(this.game);
        model.size.setWH(20);
        model.color.setRGB(0,222,0);
        (model.fillColor as Color).setRGB(0,0,0);
        model.lineWidth = 2;
        this.appendChild(model);
        model.anchorPoint.setToCenter();
        model.transformPoint.setToCenter();

        // created with https://editor.method.ac/
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
           M 250,80 H 50 Q 30,80 30,50 Q 30,20 50,20 H 250 Q 280,20,280,50 Q 280,80,250,80Z
           `
        );
        this.appendChild(polyLine1.cacheAsBitmap());

        const anim1 = new MoveByPathAnimation(this.game,polyLine1);
        anim1.velocity = 150;
        anim1.rotate = true;
        anim1.repeatCount = 2;
        model.addPropertyAnimation(anim1);
    }

}
