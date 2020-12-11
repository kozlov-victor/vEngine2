import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Size} from "@engine/geometry/size";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    // https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D/arc
    public onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,new Size(300,300));
        surface.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(surface);
        surface.setLineWidth(1);
        surface.setFillColor(0,0,0,255);
        surface.setDrawColor(0,0,0,255);

        // Draw shapes
        let i,j:number;
        for (i=0;i<4;i++){
            for(j=0;j<3;j++){
                const x              = 25+j*50;               // x coordinate
                const y              = 25+i*50;               // y coordinate
                const radius         = 20;                    // Arc radius
                const startAngle     = 0;                     // Starting point on circle
                const endAngle       = Math.PI+(Math.PI*j)/2; // End point on circle
                const anticlockwise  = i%2===1;                // Draw anticlockwise

                if (i>1){
                    surface.fillArc(x,y,radius,startAngle,endAngle, anticlockwise);
                } else {
                    surface.drawArc(x,y,radius,startAngle,endAngle, anticlockwise);
                }
            }
        }

    }

}
