import {Scene} from "@engine/scene/scene";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MathEx} from "@engine/misc/math/mathEx";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {DRAG_EVENTS} from "@engine/behaviour/impl/draggable/dragEvents";

export class MainScene extends Scene {

    private polyline:PolyLine;
    private controlPoints:Circle[] = [];
    private points:number[] = [];

    public override onReady():void {
        for (let i:number=0;i<6;i++) {
            this.createControlCircle();
        }
        this.populatePoints();
        this.updatePolyline();
    }

    private updatePolyline():void{
        if (this.polyline!==undefined) {
            this.polyline.destroy();
            this.removeChild(this.polyline);
        }
        this.polyline = PolyLine.splineFromPoints(this.game,this.points,{lineWidth:20});
        this.polyline.color.setRGB(12,122,22);
        this.prependChild(this.polyline);
    }

    private createControlCircle():void{
        const c = new Circle(this.game);
        c.radius = 30;
        c.fillColor.setRGB(23,20,200);
        const d = c.radius*2;
        c.pos.setXY(
            MathEx.random(d,this.game.size.width - d),
            MathEx.random(d,this.game.size.height - d)
        );
        this.appendChild(c);
        this.controlPoints.push(c);
        c.addBehaviour(new DraggableBehaviour(this.game));
        c.dragEventHandler.on(DRAG_EVENTS.dragMove,e=>{
            this.populatePoints();
            this.updatePolyline();
        });
    }

    private populatePoints():void{
        this.points = [];
        this.controlPoints.forEach(c=>{
            this.points.push(c.center.x,c.center.y);
        });
    }

}
