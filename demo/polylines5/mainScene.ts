import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M10 80 Q 95 10 180 80
            M10 80 Q 52.5 10, 95 80 T 180 80

            M 10 315
            L 110 215
            A 36 60 0 0 1 150.71 170.29
            L 172.55 152.45
            A 30 50 -45 0 1 215.1 109.9
            L 315 10

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

        `);



        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));


        // test compressed path
        const polyLine2:PolyLine = PolyLine.fromSvgPath(this.game,`
            M0,200v-50h50v-50h50v-50h50v-50h50v200z
        `);
        polyLine2.pos.setXY(0,0);
        polyLine2.color = Color.RGB(222,20,12);
        polyLine2.lineWidth = 2;
        this.appendChild(polyLine2);
        polyLine2.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
