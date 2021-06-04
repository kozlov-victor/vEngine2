import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {


    public override onPreloading(taskQueue:TaskQueue):void {

        // curve from https://habr.com/ru/post/450924/
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M 0 0 c 3.4 -6.8 27.8 -54.2 56 -37.7 C 73.3 -27.5 89.6 -5.1 81.9 5.9 c -5.8 8.3 -24.7 8.7 -45.4 -0.4
            `
        );
        polyLine1.pos.setXY(81,68);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));



    }

}
