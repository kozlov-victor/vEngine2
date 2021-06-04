import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj6/tiger.x.obj')
    private data1:string;

    @Resource.Texture('./model3dFromObj6/tiger.png')
    private dataTexture:ITexture;

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
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            // obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);

    }

}
