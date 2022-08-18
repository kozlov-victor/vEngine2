import {Scene} from "@engine/scene/scene";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ICubeMapTexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj9/dogPaint3d.obj')
    private data1:string;

    @Resource.CubeTexture(
        './cubeMapTexture/textures/cm_left.jpg',
        './cubeMapTexture/textures/cm_right.jpg',
        './cubeMapTexture/textures/cm_top.jpg',
        './cubeMapTexture/textures/cm_bottom.jpg',
        './cubeMapTexture/textures/cm_front.jpg',
        './cubeMapTexture/textures/cm_back.jpg',
    )
    private cubeTexture:ICubeMapTexture;


    public override onReady():void {

        const obj = new ObjParser().parse(this.game,{
            meshData: this.data1,
            cubeMapTexture: this.cubeTexture
        });
        obj.pos.setXY(200,250);
        obj._children.forEach(c=>{
            (c as Model3d).material.reflectivity = 0.5;
        });
        obj.size.setWH(200,200);
        obj.scale.setXYZ(800);
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
