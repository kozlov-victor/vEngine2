import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {AbstractEntity} from "../common/abstractEntity";

export class Stone extends AbstractEntity {

    constructor(game:Game, scene:Scene,private r:AssetsHolder) {
        super(game,scene);
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

        obj._children.forEach(c=>{
            (c as Model3d).material.specular = 0.5;
        });
        obj.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },1);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

}
