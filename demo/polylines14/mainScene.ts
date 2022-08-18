import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {TaskQueue} from "@engine/resources/taskQueue";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


export class MainScene extends Scene {

    public override onPreloading(taskQueue:TaskQueue):void {

        // https://www.w3.org/TR/SVG/paths.html
        const polygon1:Polygon = Polygon.fromSvgPath(this.game,`
            M300,200 h-150 a150,150 0 1,0 150,-150 z
        `);
        console.log(polygon1);
        polygon1.pos.setXY(0,0);
        polygon1.fillColor = Color.RGB(255,0,0);
        this.appendChild(polygon1);
        polygon1.addBehaviour(new DraggableBehaviour(this.game));

        const polygon2:Polygon = Polygon.fromSvgPath(this.game,`
            M275,175 v-150 a150,150 0 0,0 -150,150 z
        `);
        polygon2.pos.setXY(0,0);
        polygon2.fillColor = Color.RGB(255,255,0);
        this.appendChild(polygon2);
        polygon2.addBehaviour(new DraggableBehaviour(this.game));

        this.mouseEventHandler.once(MOUSE_EVENTS.click, e=>{
            const meshes = [
                polygon1.extrudeToMesh(100),
                polygon2.extrudeToMesh(100),
            ];

            meshes.forEach(mesh=>{
                mesh.transformPoint.setToCenter();
                mesh.addBehaviour(new DraggableBehaviour(this.game));
                mesh.pos.setXY(100);
                this.appendChild(mesh);
                mesh.setInterval(()=>{
                    mesh.angle3d.x+=0.01;
                    mesh.angle3d.y+=0.01;
                },10);
            });

        });

    }


}
