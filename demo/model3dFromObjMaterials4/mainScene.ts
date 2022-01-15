import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ITexture} from "@engine/renderer/common/texture";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObjMaterials4/Nightmare/Nightmare.obj')
    private meshData:string;

    @Resource.Text('./model3dFromObjMaterials4/Nightmare/Nightmare.mtl')
    private materialData:string;

    @Resource.Texture('./model3dFromObjMaterials4/Nightmare/NIT.png')
    private texture:ITexture;

    public override onReady():void {

        const obj:SimpleGameObjectContainer = new ObjParser().parse(this.game,
            {
                meshData: this.meshData,
                materialsData:this.materialData,
                texture: this.texture,
            }
        );
        obj.pos.setXY(300,400);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(2);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.y-=0.01;
            obj.angle3d.x-=0.01;
        },20);

    }

}
