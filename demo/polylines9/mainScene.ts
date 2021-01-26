import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";


export class MainScene extends Scene {



    public onPreloading():void {

        // https://www.w3.org/TR/SVG/paths.html

        const container:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
        container.size.setWH(300,300);
        container.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(container);

        PolyLine.fromMultiCurveSvgPath(this.game,`
                 M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80
                 M10 80 Q 95 10 180 80
                 M100,10 l 50,-25
                 a25,25 -30 0,1 50,-25 l 50,-25
                 a25,50 -30 0,1 50,-25 l 50,-25
                 a25,75 -30 0,1 50,-25 l 50,-25
                 a25,100 -30 0,1 50,-25 l 50,-25
                 M100,200 C100,100 250,100 250,200
                 S400,300 400,200
        `).forEach(p=>{
            p.pos.setXY(0,0);
            p.color = Color.RGB(100,20,222);
            p.lineWidth = 2;
            container.appendChild(p);
        });

    }

    public onProgress(val: number):void {

    }

    public onReady():void {

    }

}
