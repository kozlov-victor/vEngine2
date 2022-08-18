import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {



    public override onPreloading(taskQueue:TaskQueue):void {

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
               M 10,30
               A 20,20 0,0,1 50,30
               A 20,20 0,0,1 90,30
               Q 90,60 50,90
               Q 10,60 10,30 z

        `,{
                lineWidth: 2,
            }
        );

        polyLine1.pos.setXY(0,0);
        polyLine1.color.setRGB(100,20,222);
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }


}
