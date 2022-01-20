import {AbstractEntity} from "../common/abstractEntity";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Color} from "@engine/renderer/common/color";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export class Ring extends AbstractEntity {

    constructor(game:Game, scene:Scene,private r:AssetsHolder) {
        super(game,scene);
        this.createParticles();
        this.createGeometry();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataRing,
            materialsData: this.r.dataRingMaterial,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(10);

        obj.children.forEach(c=>{
            (c as Model3d).material.specular = 0.6;
        });
        obj.setInterval(()=>{
            obj.angle3d.y+=0.06;
        },1);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

    private createParticles():void {
        const rectangle = new Rectangle(this.game);
        rectangle.size.setWH(8,5);
        rectangle.transformPoint.setToCenter();
        rectangle.fillColor = Color.fromCssLiteral(`#ff0000`);
        rectangle.blendMode = BLEND_MODE.SUBSTRACTIVE;
        rectangle.velocity.y = -100;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(rectangle);
        ps.emissionRadius = 10;
        //ps.forceDrawChildrenOnNewSurface = true;

        ps.numOfParticlesToEmit = {from:10,to:20};
        ps.particleLiveTime = {from:100,to:400};
        const emissionAngle = 40;
        this.appendChild(ps);
        ps.particleAngle = {from:MathEx.degToRad(-90-emissionAngle),to:MathEx.degToRad(-90+emissionAngle)};
        ps.emissionPosition.setXY(0,0);
    }

}
