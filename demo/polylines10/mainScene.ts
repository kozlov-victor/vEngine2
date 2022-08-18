import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {



    public override onPreloading(taskQueue:TaskQueue):void {

        // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths

        // <svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
        //      <path d="M10 80 Q 52.5 10, 95 80 T 180 80" stroke="black" fill="transparent"/>
        // </svg>

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
               M10 80 Q 52.5 10, 95 80 T 180 80
        `,{lineWidth:2});

        polyLine1.pos.setXY(0,0);
        polyLine1.color.setRGB(100,20,222);
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

}
