import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TaskQueue} from "@engine/resources/taskQueue";
import {PolyTriangTest} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/polyTriangTest";


export class MainScene extends Scene {


    public override onPreloading(taskQueue:TaskQueue):void {

        // curve from https://habr.com/ru/post/450924/
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M 0 0 L 1 1 L 99 99 L 100 100
            `
        );
        polyLine1.pos.setXY(100,100);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));


        const mesh2 = PolyTriangTest.fromPolyline(this.game,polyLine1);
        mesh2.size.setWH(300,300);
        mesh2.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(mesh2);

    }

}
