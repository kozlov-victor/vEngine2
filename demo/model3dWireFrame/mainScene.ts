import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {DRAW_METHOD} from "@engine/renderer/webGl/base/bufferInfo";
import {Sphere} from "@engine/renderer/webGl/primitives/sphere";

export class MainScene extends Scene {


    public override onReady():void {

        const primitive = new Sphere(120, 50);
        primitive.drawMethod = DRAW_METHOD.LINES;
        const obj:Model3d = new Model3d(this.game,primitive);
        obj.fillColor.setRGB(222,22,12);
        obj.colorMix = 0.5;

        obj.pos.setXY(150,150);
        obj.size.setWH(100,100);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
        },20);

    }

}
