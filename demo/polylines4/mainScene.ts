import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {

        // https://danmarshall.github.io/google-font-to-svg-path/
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
          M 9 30 
          A 24 24 0 0 0 10 35
         
          `
        );
        polyLine1.pos.setXY(81,68);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 0.7;
        polyLine1.scale.setXY(5);
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
