import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {



    public onPreloading(taskQueue:TaskQueue):void {

        const polyLines:PolyLine[] = PolyLine.fromMultiCurveSvgPath(this.game,`
            M80 80
            A 45 45, 0, 0, 0, 125 125
            L 125 80 Z

            M230 80
            A 45 45, 0, 1, 0, 275 125
            L 275 80 Z

            M80 230
            A 45 45, 0, 0, 1, 125 275
            L 125 230 Z

            M230 230
            A 45 45, 0, 1, 1, 275 275
            L 275 230 Z

            M10 315
            L 110 215
            A 30 50 0 0 1 162.55 162.45
            L 172.55 152.45
            A 30 50 -45 0 1 215.1 109.9
            L 315 10
        `);
        polyLines.forEach(pl=>{
            pl.color = Color.RGB(100,20,222);
            pl.lineWidth = 2;
            pl.addBehaviour(new DraggableBehaviour(this.game));
            this.appendChild(pl);
        });


        const p:Polygon = Polygon.fromSvgPath(this.game,`
            M100,10L105.8,27.2
            123.8,27.2 109.4,38
            114.6,55.2 100,45 85.4,55.2 90.6,38
            76.2,27.2 94.2,27.2z
        `);
        p.addBehaviour(new DraggableBehaviour(this.game));
        p.fillColor = Color.RGB(122,12,12);
        this.appendChild(p);

    }

    public onProgress(val: number):void {

    }

    public onReady():void {

    }

}
