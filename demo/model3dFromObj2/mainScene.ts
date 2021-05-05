import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {ObjParser} from "../model3dFromObj/objParser";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj2/dog.obj')
    private data1Link:string;

    @Resource.Texture('./model3dFromObj2/dog.jpg')
    private dataTextureLink:ITexture;

    public onReady():void {
        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link);
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(6);
        obj.texture = this.dataTextureLink;
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);
    }

}
