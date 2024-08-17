import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj12/rocket.obj') public readonly modelData:string;


    public override onReady():void {

        const obj = new ObjParser().parse(this.game,{
            meshData: this.modelData,
        });
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(15);

        this.appendChild(obj);
        const timer = this.setInterval(()=>{
            obj.angle3d.y+=0.01;
        },20);
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            timer.kill();
            new TrackBall(this,obj);
        });

    }

}
