import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {AssetsHolder} from "../assets/assetsHolder";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Tween} from "@engine/animation/tween";
import {Scene} from "@engine/scene/scene";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MathEx} from "@engine/misc/mathEx";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Color} from "@engine/renderer/common/color";
import {AbstractEntity} from "./common/abstractEntity";

export class MainShip extends AbstractEntity {

    constructor(game:Game,scene:Scene,private r:AssetsHolder) {
        super(game,scene);
        this.createGeometry();
        this.createParticles();
        this.burn();
    }

    private createGeometry():void {
        const obj = new ObjParser().parse(this.game,{
            meshData: this.r.dataMainShip,
            materialsData: this.r.dataMainShipMaterial,
            //cubeMapTexture: this.cubeTexture,
            //texture: this.texture,
        });
        this.addBehaviour(new DraggableBehaviour(this.game));
        this.size.setWH(400);

        obj.children.forEach(c=>{
            (c as Model3d).material.specular = 0.3;
        });
        const lamp = obj.children.find(it=>it.id==='light') as RenderableModel;
        this.setInterval(()=>{
            lamp.alpha = lamp.alpha===1?0:1;
        },1000);

        obj.scale.setXYZ(10);
        this.appendChild(obj);

        const t = new Tween(this.game,{
            target:obj.angle3d,
            from: {x:-0.2},
            to: {x:0.2},
            time: 4000,
            yoyo: true,
            loop: true,
        });
        this.addTween(t);

        this.scene.appendChild(this);
    }

    public burn():void {
        const circle:Circle = new Circle(this.game);
        circle.radius = 6;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        circle.billBoard = true;
        //circle.blendMode = BLEND_MODE.ADDITIVE;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(circle);
        ps.emissionRadius = 5;
        ps.forceDrawChildrenOnNewSurface = true;

        ps.numOfParticlesToEmit = {from:10,to:50};
        ps.particleLiveTime = {from:100,to:120};
        ps.emissionPosition = this.pos;
        ps.pos.setXY(-15,-15);
        const emissionAngle = 40;
        this.scene.appendChild(ps);
        const col1 = Color.fromCssLiteral(`rgb(24, 64, 108)`);
        const col2 = Color.fromCssLiteral(`#000000`);
        ps.onEmitParticle(p=>{
            (p as Circle).fillColor = MathEx.randomInt(0,100)>50? col1:col2;
        });
        ps.particleAngle = {from:MathEx.degToRad(-90-emissionAngle),to:MathEx.degToRad(-90+emissionAngle)};
    }

    private createParticles():void {
        const circle:Circle = new Circle(this.game);
        circle.radius = 3;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        circle.fillColor = Color.fromCssLiteral(`#fff900`);
        circle.blendMode = BLEND_MODE.ADDITIVE;
        circle.velocity.x = -100;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(circle);
        ps.emissionRadius = 0;
        ps.forceDrawChildrenOnNewSurface = true;

        ps.numOfParticlesToEmit = {from:10,to:20};
        ps.particleLiveTime = {from:10,to:100};
        const emissionAngle = 10;
        this.appendChild(ps);
        ps.particleAngle = {from:MathEx.degToRad(180-emissionAngle),to:MathEx.degToRad(180+emissionAngle)};
        ps.emissionPosition.setXY(-55,0);
    }


}
