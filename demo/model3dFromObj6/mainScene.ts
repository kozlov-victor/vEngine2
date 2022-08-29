import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj6/tiger.x.obj')
    public readonly data1:string;

    @Resource.Texture('./model3dFromObj6/tiger.png')
    public readonly dataTexture:ITexture;

    public override onReady():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.data1,
            texture: this.dataTexture
        });
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(320);
        this.appendChild(obj);
        //obj.acceptLight(false);
        const timer = this.setInterval(()=>{
            // obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            timer.kill();
            new TrackBall(this,obj);
        });

    }

}
