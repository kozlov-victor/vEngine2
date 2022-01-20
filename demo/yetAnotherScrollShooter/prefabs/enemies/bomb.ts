import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Color} from "@engine/renderer/common/color";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {AbstractEntity} from "../common/abstractEntity";

export class Bomb extends AbstractEntity {

    constructor(game:Game, scene:Scene,private r:AssetsHolder) {
        super(game,scene);
        this.createParticles();
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataBomb,
            materialsData: this.r.dataBombMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj.children.forEach(c=>{
            (c as Model3d).material.specular = 0.4;
        });
        obj.setInterval(()=>{
            obj.angle3d.y+=0.03;
        },1);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

    private createParticles():void {
        const circle = new Circle(this.game);
        circle.radius = 5;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        circle.velocity.y = -120;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(circle);
        ps.emissionRadius = 5;
        ps.forceDrawChildrenOnNewSurface = true;
        ps.pos.y = -20;

        ps.numOfParticlesToEmit = {from:10,to:20};
        ps.particleLiveTime = {from:10,to:300};
        const emissionAngle = 15;
        this.appendChild(ps);
        ps.particleAngle = {from:MathEx.degToRad(-90-emissionAngle),to:MathEx.degToRad(-90+emissionAngle)};

        const col1 = Color.fromCssLiteral(`#ff746e`);
        const col2 = Color.fromCssLiteral(`#0a0909`);
        ps.onEmitParticle(p=>{
            (p as Circle).fillColor = MathEx.randomInt(0,100)>50? col1:col2;
        });
    }

}
