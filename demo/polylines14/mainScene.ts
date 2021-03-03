import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {



    public onPreloading(taskQueue:TaskQueue):void {

        // https://www.w3.org/TR/SVG/paths.html
        const polygon1:Polygon = Polygon.fromSvgPath(this.game,`
            M300,200 h-150 a150,150 0 1,0 150,-150 z
        `);
        polygon1.pos.setXY(0,0);
        polygon1.fillColor = Color.RGB(255,0,0);
        this.appendChild(polygon1);
        polygon1.addBehaviour(new DraggableBehaviour(this.game));

        const polygon2:Polygon = Polygon.fromSvgPath(this.game,`
            M275,175 v-150 a150,150 0 0,0 -150,150 z
        `);
        polygon2.pos.setXY(0,0);
        polygon2.fillColor = Color.RGB(255,255,0);
        this.appendChild(polygon2);
        polygon2.addBehaviour(new DraggableBehaviour(this.game));



    }

    public onProgress(val: number):void {

    }

    public onReady():void {

    }

}
