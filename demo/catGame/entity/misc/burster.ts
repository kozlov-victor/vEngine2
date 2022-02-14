import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Game} from "@engine/core/game";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Rect} from "@engine/geometry/rect";

export class Burster {


    private constructor(private game:Game) {
        this.particleSystem = new ParticleSystem(this.game);
        const particle:Circle = new Circle(this.game);
        particle.radius = 2;
        particle.transformPoint.setXY(particle.radius/2,particle.radius/2);
        particle.fillColor.setRGBA(12,100,0);
        const body = game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            debug: true,
            rect: new Rect(0,0,2,2),
            groupNames: [Burster.groupName]
        });
        //body.ignoreCollisionWithGroupNames.push('entity');
        particle.setRigidBody(body);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.emitAuto = false;
        ps.addParticlePrefab(particle);
        ps.emissionRadius = 5;

        ps.numOfParticlesToEmit = {from:1,to:5};
        ps.particleLiveTime = {from:1000,to:2000};
        ps.particleVelocity = {from: 50, to: 100};
        ps.particleAngle = {from:0,to:2*Math.PI};
        ps.emitAuto = false;
        game.getCurrentScene().getLayerAtIndex(1).appendChild(ps);
        this.particleSystem = ps;
    }

    public static readonly groupName:string = 'particle';

    private static instance:Burster;

    private particleSystem:ParticleSystem;

    public static getCreatedInstance():Burster {
        return Burster.instance;
    }

    public static instantiate(game:Game):void {
        Burster.instance = new Burster(game);
    }

    public burst(x:number,y:number):void {
        this.particleSystem.emissionPosition.setXY(x,y);
        this.particleSystem.emit();
    }

}
