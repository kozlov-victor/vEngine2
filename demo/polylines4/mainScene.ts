import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {TaskQueue} from "@engine/resources/taskQueue";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";


export class MainScene extends Scene {


    public override onPreloading(taskQueue:TaskQueue):void {


        const n = new SimpleGameObjectContainer(this.game);
        n.forceDrawChildrenOnNewSurface = true;
        n.scale.setXY(0.5);
        n.size.setWH(500);
        n.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(n);

        const path = `

            M306 385l99 -100v-186l-88 -100h-191l-86 100v489l87 84h184l85 -85l-1 -111h-46v83l-55 62h-150l-59 -62h-1v-237l76 64zM160 337l-76 -70v-149l59 -67l157 -1l56 63v154l-65 69z

            `;

        Polygon.fromMultiCurveSvgPath(this.game,path).forEach((p,i)=>{
            p.pos.setXY(0,0);
            p.fillColor.setFrom(Color.RGB(12,200,22));
            if (i>0) p.filters = [new EvenOddCompositionFilter(this.game)];
            n.appendChild(p);
        });

    }

    public override onProgress(val: number):void {

    }

    public override onReady():void {

    }

}
