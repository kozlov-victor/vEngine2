import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Game} from "@engine/core/game";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";

export class Burster {

    public static readonly groupName:string = 'particle';

    public static getCreatedInstance():Burster {
        return Burster.instance;
    }

    private static instance:Burster;

    private particleSystem:ParticleSystem;


    constructor(private game:Game) {
        Burster.instance = this;
        this.particleSystem = new ParticleSystem(this.game);
        const particle:Rectangle = new Rectangle(this.game);
        particle.size.setWH(5);
        particle.transformPoint.setXY(particle.size.width/2,particle.size.height/2);
        (particle.fillColor as Color).setRGBA(133,200,0);
        const body = game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({type:ARCADE_RIGID_BODY_TYPE.DYNAMIC});
        body.groupNames.push(Burster.groupName,'entity');
        body.ignoreCollisionWithGroupNames.push('entity');
        particle.setRigidBody(body);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.emitAuto = false;
        ps.addParticle(particle);
        ps.emissionRadius = 5;
        ps.emissionTarget = game.getCurrScene();

        ps.numOfParticlesToEmit = {from:1,to:5};
        ps.particleLiveTime = {from:1000,to:2000};
        ps.particleVelocity = {from: 50, to: 100};
        ps.particleAngle = {from:0,to:2*Math.PI};
        ps.emitAuto = false;
        game.getCurrScene().appendChild(ps);
        this.particleSystem = ps;
    }

    public burst(x:number,y:number):void {
        this.particleSystem.emissionPosition.setXY(x,y);
        this.particleSystem.emit();
    }

}
