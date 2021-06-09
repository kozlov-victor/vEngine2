import {AbstractEntity} from "./common/abstractEntity";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Tween} from "@engine/animation/tween";
import {EasingElastic} from "@engine/misc/easing/functions/elastic";

export class Engine extends AbstractEntity {
    constructor(game:Game,private scene:Scene,private r:AssetsHolder) {
        super(game);
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataEngine,
            materialsData: this.r.dataEngineMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj.children.forEach(c=>{
            (c as Model3d).specular = 0.4;
        });

        const t = new Tween({
            target:obj.angle3d,
            from: {x:-0.2},
            to: {x:0.2},
            time: 3000,
            yoyo: true,
            loop: true,
        });
        this.addTween(t);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }
}
