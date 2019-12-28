import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MoveByCircleAnimation} from "@engine/animation/propertyAnimation/moveByCircleAnimation";
import {Point2d} from "@engine/geometry/point2d";

export class MainScene extends Scene {

    public onReady() {
        const r = new Rectangle(this.game);
        r.size.setWH(20,20);
        this.appendChild(r);

        const anim1 = new MoveByCircleAnimation(this.game);
        this.addPropertyAnimation(anim1);
        anim1.onProgress((p)=>{
            r.pos.set(p);
        });

    }

}
