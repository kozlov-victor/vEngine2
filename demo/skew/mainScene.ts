import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";


// example from https://www.panda2.io/examples#sprite-skew
export class MainScene extends Scene {


    public onReady() {

        const r:Rectangle = new Rectangle(this.game);
        r.size.setWH(100);
        r.pos.setXY(100,100);
        r.lineWidth = 3;
        this.appendChild(r);

        const r1:Rectangle = new Rectangle(this.game);
        r1.size.setWH(100);
        r1.pos.setXY(100,200);
        r1.scale.y=0.2;
        r1.skew.x=0.2;
        this.appendChild(r1);

        const r2:Rectangle = new Rectangle(this.game);
        r2.size.setWH(100);
        r2.pos.setXY(200,100);
        r2.scale.x=0.2;
        r2.skew.y=0.2;
        this.appendChild(r2);

    }

}
