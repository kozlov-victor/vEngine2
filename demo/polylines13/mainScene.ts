import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {

        // https://www.w3.org/TR/SVG/paths.html
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M300,200 h-150 a150,150 0 1,0 150,-150 z
        `);
        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

        const polyLine2:PolyLine = PolyLine.fromSvgPath(this.game,`
            M275,175 v-150 a150,150 0 0,0 -150,150 z
        `);
        polyLine2.pos.setXY(0,0);
        polyLine2.color = Color.RGB(100,20,222);
        polyLine2.lineWidth = 2;
        this.appendChild(polyLine2);
        polyLine2.addBehaviour(new DraggableBehaviour(this.game));



    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
