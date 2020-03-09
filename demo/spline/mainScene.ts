import {Scene} from "@engine/scene/scene";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/mathEx";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {

    private polyline:PolyLine;
    private controlPoints:Circle[] = [];
    private points:number[] = [];

    public onPreloading() {

    }


    public onReady() {
        for (let i:number=0;i<6;i++) {
            this.createControlCircle();
        }
        this.populatePoints();
        this.updatePolyline();
    }

    private updatePolyline(){
        if (this.polyline!==undefined) {
            this.removeChild(this.polyline);
        }
        this.polyline = PolyLine.splineFromPoints(this.game,this.points);
        this.polyline.lineWidth = 20;
        this.polyline.color.setRGB(12,122,22);
        this.polyline.passMouseEventsThrough = true;
        this.prependChild(this.polyline);
    }

    private createControlCircle(){
        const c = new Circle(this.game);
        c.radius = 30;
        (c.fillColor as Color).setRGB(23,20,200);
        const d = c.radius*2;
        c.pos.setXY(
            MathEx.random(d,this.game.size.width - d),
            MathEx.random(d,this.game.size.height - d)
        );
        this.appendChild(c);
        this.controlPoints.push(c);
        c.addBehaviour(new DraggableBehaviour(this.game));
        c.on(MOUSE_EVENTS.dragMove,e=>{
            this.populatePoints();
            this.updatePolyline();
        });
    }

    private populatePoints(){
        this.points = [];
        this.controlPoints.forEach(c=>{
            this.points.push(c.center.x,c.center.y);
        });
    }

}
