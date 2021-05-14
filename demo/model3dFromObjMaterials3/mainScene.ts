import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObjMaterials3/book/book.obj')
    private meshData:string;


    public onReady():void {

        const obj:SimpleGameObjectContainer = new ObjParser().parse(this.game,
            {
                meshData:this.meshData,
            }
        );
        obj.pos.setXY(300,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(820);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.y-=0.01;
        },20);

    }

}
