import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {

        // https://www.w3.org/TR/SVG/paths.html

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
                 M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80
                 M10 80 Q 95 10 180 80
                 M100,10 l 50,-25
                 a25,25 -30 0,1 50,-25 l 50,-25
                 a25,50 -30 0,1 50,-25 l 50,-25
                 a25,75 -30 0,1 50,-25 l 50,-25
                 a25,100 -30 0,1 50,-25 l 50,-25
                 M100,200 C100,100 250,100 250,200
                 S400,300 400,200
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
