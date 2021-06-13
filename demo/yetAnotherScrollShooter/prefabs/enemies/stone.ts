import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {AbstractEntity} from "../common/abstractEntity";

export class Stone extends AbstractEntity {

    constructor(game:Game,private scene:Scene,private r:AssetsHolder) {
        super(game);
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataStone,
            materialsData: this.r.dataStoneMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj.children.forEach(c=>{
            (c as Model3d).specular = 0.5;
        });
        obj.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },1);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

}
