import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    public onReady() {

        //todo doesnot work

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0;//-Math.PI/2;
        gradient.colorFrom = Color.RGB(255,0,0);
        gradient.colorTo = Color.RGB(0,255,0);
        rect.fillGradient = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(300,400);
        rect.pos.setXY(100,100);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);
        rect.setInterval(()=>{
            gradient.angle+=0.1;
        },100);

    }



}
