import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Color} from "@engine/renderer/common/color";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {AbstractEntity} from "../common/abstractEntity";

export class Rocket extends AbstractEntity {

    constructor(game:Game, scene:Scene,private r:AssetsHolder) {
        super(game,scene);
        this.createParticles();
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataRocket,
            materialsData: this.r.dataRocketMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj.children.forEach(c=>{
            (c as Model3d).specular = 0.3;
        });
        obj.setInterval(()=>{
            obj.angle3d.x+=0.01;
        },1);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

    private createParticles():void {
        const circle:Circle = new Circle(this.game);
        circle.radius = 5;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        circle.fillColor = Color.fromCssLiteral(`#25871b`);
        circle.blendMode = BLEND_MODE.ADDITIVE;
        circle.velocity.x = 100;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(circle);
        ps.emissionRadius = 5;
        ps.forceDrawChildrenOnNewSurface = true;
        ps.pos.x = 50;

        ps.numOfParticlesToEmit = {from:10,to:20};
        ps.particleLiveTime = {from:10,to:300};
        const emissionAngle = 10;
        this.appendChild(ps);
        ps.particleAngle = {from:MathEx.degToRad(-emissionAngle),to:MathEx.degToRad(emissionAngle)};
    }

}
