import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {


    public onReady() {

        for (let i:number = 0;i<20;i++) {
            const spr:Circle = new Circle(this.game);
            spr.pos.setXY(MathEx.random(0,this.game.size.width),MathEx.random(0,this.game.size.height));
            this.appendChild(spr);
            spr.transformPoint.setToCenter();

            spr.on(MOUSE_EVENTS.mouseEnter, (e)=>{
                spr.scale.setXY(1.4);
            });
            spr.on(MOUSE_EVENTS.mouseLeave, (e)=>{
                spr.scale.setXY(1);
            });

            spr.addBehaviour(new DraggableBehaviour(this.game));

        }


    }

}
