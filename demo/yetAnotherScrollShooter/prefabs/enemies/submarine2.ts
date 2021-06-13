import {AbstractEntity} from "../common/abstractEntity";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Tween} from "@engine/animation/tween";

export class Submarine2 extends AbstractEntity {

    constructor(game:Game,private scene:Scene,private r:AssetsHolder) {
        super(game);
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataSubmarine2,
            materialsData: this.r.dataSubmarine2Material,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj.children.forEach(c=>{
            (c as Model3d).specular = 0.4;
        });

        const t = new Tween({
            target:obj.pos,
            from: {y:-15},
            to: {y:20},
            time: 2100,
            yoyo: true,
            loop: true,
        });
        this.addTween(t);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

}
