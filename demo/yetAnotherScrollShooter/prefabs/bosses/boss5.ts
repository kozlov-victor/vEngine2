import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Tween} from "@engine/animation/tween";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MathEx} from "@engine/misc/mathEx";
import {Color} from "@engine/renderer/common/color";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";

export class Boss5 extends SimpleGameObjectContainer {

    constructor(game:Game,private scene:Scene,private r:AssetsHolder) {
        super(game);
        this.createGeometry();
        //this.createParticles();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataBoss5,
            materialsData: this.r.dataBoss5Material,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);
        obj.scale.setXYZ(30);

        const wheel = obj.children.find(it=>it.id.indexOf('wheel')>-1)!;

        obj.setInterval(()=>{
            wheel.angle3d.x+=0.04;
        },1);

        const t = new Tween({
            target:obj.angle3d,
            from: {x:-0.3},
            to: {x:0.3},
            time: 4000,
            yoyo: true,
            loop: true,
        });
        this.addTween(t);

        this.appendChild(obj);
        this.scene.appendChild(this);
    }

    private createParticles():void {
        const circle = new Circle(this.game);
        circle.radius = 7;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        circle.velocity.y = -120;
        circle.blendMode = BLEND_MODE.ADDITIVE;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(circle);
        ps.emissionRadius = 50;
        ps.forceDrawChildrenOnNewSurface = true;
        ps.pos.y = -20;

        ps.numOfParticlesToEmit = {from:10,to:20};
        ps.particleLiveTime = {from:1000,to:2000};
        const emissionAngle = 15;
        this.scene.appendChild(ps);
        ps.particleAngle = {from:MathEx.degToRad(-90-emissionAngle),to:MathEx.degToRad(-90+emissionAngle)};
        ps.emissionPosition = this.pos;

        const col1 = Color.fromCssLiteral(`#35ce3a`);
        const col2 = Color.fromCssLiteral(`#ecc340`);
        ps.onEmitParticle(p=>{
            p.pos.z = -20;
            (p as Circle).fillColor = MathEx.randomInt(0,100)>50? col1:col2;
        });
    }

}
