import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj7/mushroom_tube_A.obj')
    private data1:string;

    @Resource.Texture('./model3dFromObj7/mushroom_tube_tex.png')
    private dataTexture:ITexture;

    // //https://www.reinerstilesets.de/graphics/3d-grafiken/3d-plants/
    @Resource.Texture('./model3dFromObj7/mushroom_tube_NM.png')
    private dataTextureNormal:ITexture;

    public override onReady():void {

        const obj = new ObjParser().parse(this.game,{
            meshData: this.data1,
            texture: this.dataTexture,
            normalsTexture: this.dataTextureNormal
        });
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(60);
        this.appendChild(obj);
        const timer = this.setInterval(()=>{
            //obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            timer.kill();
            new TrackBall(this,obj);
        });

    }

}
