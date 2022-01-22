import {AbstractEntity} from "../common/abstractEntity";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Tween} from "@engine/animation/tween";

export class Submarine extends AbstractEntity {

    constructor(game:Game, scene:Scene,private r:AssetsHolder) {
        super(game,scene);
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataSubmarine,
            materialsData: this.r.dataSubmarineMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj._children.forEach(c=>{
            (c as Model3d).material.specular = 0.4;
        });

        const t = new Tween(this.game,{
            target:obj.pos,
            from: {y:-15},
            to: {y:15},
            time: 2000,
            yoyo: true,
            loop: true,
        });
        this.addTween(t);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

}
