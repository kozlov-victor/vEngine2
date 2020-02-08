
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";


export class MainScene extends Scene {



    public onPreloading() {


        const n = new NullGameObject(this.game);
        n.scale.setXY(0.5);
        n.size.setWH(500);
        n.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(n);

        const path = `

            M306 385l99 -100v-186l-88 -100h-191l-86 100v489l87 84h184l85 -85l-1 -111h-46v83l-55 62h-150l-59 -62h-1v-237l76 64zM160 337l-76 -70v-149l59 -67l157 -1l56 63v154l-65 69z

            `;


        const polygons:Polygon[] = Polygon.fromMultiCurveSvgPath(this.game,path);
        polygons.forEach(p=>{
            p.fillColor = Color.RGB(12,200,22);
            n.appendChild(p);
        });

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,path);
        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        n.appendChild(polyLine1);

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
