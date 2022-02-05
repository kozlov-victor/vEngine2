import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DRAG_EVENTS} from "@engine/behaviour/impl/dragEvents";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {


    public override onReady():void {

        const container = new Rectangle(this.game);
        container.fillColor.setFrom(ColorFactory.fromCSS(`#d3ffb3`));
        container.size.setFrom(this.game.size);
        this.appendChild(container);

        for (let i:number = 0;i<20;i++) {
            const spr:Circle = new Circle(this.game);
            spr.radius = 50;
            spr.lineWidth = 3;
            spr.color.setFrom(ColorFactory.fromCSS('#e04949'));
            spr.fillColor.setFrom(ColorFactory.fromCSS('#3c11d9'));
            spr.pos.setXY(MathEx.random(0,this.game.size.width),MathEx.random(0,this.game.size.height));
            container.appendChild(spr);
            spr.transformPoint.setToCenter();

            spr.mouseEventHandler.on(MOUSE_EVENTS.mouseEnter, (e)=>{
                spr.scale.setXY(1.4);
            });
            spr.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, (e)=>{
                spr.scale.setXY(1);
            });
            spr.dragEventHandler.on(DRAG_EVENTS.dragStart, e=>{
                spr.moveToFront();
                spr.color.setFrom(ColorFactory.fromCSS('#eec240'));
            });
            spr.dragEventHandler.on(DRAG_EVENTS.dragMove, e=>{
                spr.moveToFront();
                spr.fillColor.setFrom(ColorFactory.fromCSS('#eaacbd'));
            });
            spr.dragEventHandler.on(DRAG_EVENTS.dragStop, e=>{
                spr.moveToFront();
                spr.color.setFrom(ColorFactory.fromCSS('#8340ee'));
            });
            spr.addBehaviour(new DraggableBehaviour(this.game));

        }


    }

}
