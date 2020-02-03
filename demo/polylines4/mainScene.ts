
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {


        // https://onlinefontconverter.com/
        // https://gero3.github.io/facetype.js/

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M253 234
            h-128
            v16
            q19 5 25 11.5
            t 6 24.5
           
        `);

        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        polyLine1.scale.setXY(0.5);
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
