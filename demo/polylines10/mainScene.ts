import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {

        // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths

        // <svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
        //      <path d="M10 80 Q 52.5 10, 95 80 T 180 80" stroke="black" fill="transparent"/>
        // </svg>

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
               M10 80 Q 52.5 10, 95 80 T 180 80
        `);

        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
