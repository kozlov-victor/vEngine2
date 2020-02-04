import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {

        // https://www.w3.org/TR/SVG/images/paths/cubic02.svg
        // https://stackoverflow.com/questions/15860635/svg-path-commands-s-and-t

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
               M100,200 C100,100 400,100 400,200
               M100,500 C25,400 475,400 400,500
               M100,800 C175,700 325,700 400,800
               M600,200 C675,100 975,100 900,200
               M600,500 C600,350 900,650 900,500
               M600,800 C625,700 725,700 750,800 S875,900 900,800

               M 100,100 c 25,25 75,25 100,0 s 25,125 0,100 -75,-25 -100,0
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
