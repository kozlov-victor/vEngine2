import {AbstractEntity} from "../common/abstractEntity";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";

export class Spinner extends AbstractEntity {
    constructor(game:Game, scene:Scene,private r:AssetsHolder) {
        super(game,scene);
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataSpinner,
            materialsData: this.r.dataSpinnerMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj.children.forEach(c=>{
            (c as Model3d).specular = 0.5;
        });
        obj.setInterval(()=>{
            obj.angle3d.y+=0.02;
        },1);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }
}
