import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading():void {



        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
               M 10,30
               A 20,20 0,0,1 50,30
               A 20,20 0,0,1 90,30
               Q 90,60 50,90
               Q 10,60 10,30 z

        `);

        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onProgress(val: number):void {

    }

    public onReady():void {

    }

}
