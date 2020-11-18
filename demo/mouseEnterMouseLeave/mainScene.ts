import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export class MainScene extends Scene {


    public onReady() {

        const container = new Rectangle(this.game);
        container.fillColor.fromCSS(`#d3ffb3`);
        container.size.set(this.game.size);
        this.appendChild(container);

        for (let i:number = 0;i<20;i++) {
            const spr:Circle = new Circle(this.game);
            spr.radius = 50;
            spr.lineWidth = 3;
            spr.color.fromCSS('#e04949');
            spr.fillColor.fromCSS('#3c11d9');
            spr.pos.setXY(MathEx.random(0,this.game.size.width),MathEx.random(0,this.game.size.height));
            container.appendChild(spr);
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
