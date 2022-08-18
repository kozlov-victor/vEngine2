import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";

export class Heart extends SimpleGameObjectContainer {

    constructor(game:Game,private scene:Scene,private r:AssetsHolder) {
        super(game);
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataHeart,
            materialsData: this.r.dataHeartMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(1);

        obj.setInterval(()=>{
            obj.angle3d.y+=0.03;
        },1);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

}
