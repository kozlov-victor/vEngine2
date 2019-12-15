import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class MainScene extends Scene {

    private model:RenderableModel;

    public onReady() {

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.colorFrom = Color.RGB(100,0,20);
        gradient.colorTo = Color.RGB(200,111,1);
        rect.fillColor = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(120,60);
        rect.pos.setXY(100,100);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);
        rect.transformPoint.setXY(60,30);
        this.model = rect;

    }

    public onUpdate(){
        this.model.angle3d.x+=0.01;
    }


}
