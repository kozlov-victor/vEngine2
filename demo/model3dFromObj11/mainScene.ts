import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {ITexture} from "@engine/renderer/common/texture";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {CullFace} from "@engine/renderable/impl/3d/mesh3d";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj11/skull.obj') public readonly modelData:string;
    @Resource.Texture('./model3dFromObj11/texture.png') public readonly texture:ITexture;


    public override onReady():void {

        const obj = new ObjParser().parse(this.game,{
            meshData: this.modelData,
            texture: this.texture,
        });
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(15);
        (obj.getChildAt(0) as Model3d).acceptLight(false);
        (obj.getChildAt(0) as Model3d).cullFace = CullFace.front;

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
