import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {Color} from "@engine/renderer/common/color";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {


    public onReady() {



        const physicsSystem:ArcadePhysicsSystem = this.game.getPhysicsSystem();

        const rect1:Rectangle = new Rectangle(this.game);
        rect1.pos.setXY(10,10);
        const rigidBody1:ArcadeRigidBody = physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.DYNAMIC});
        rect1.setRigidBody(rigidBody1);
        this.appendChild(rect1);

        const rect2:Rectangle = new Rectangle(this.game);
        rect2.size.setWH(500,15);
        rect2.pos.setXY(10,200);
        rect2.setRigidBody(physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.KINEMATIC}));
        this.appendChild(rect2);

        const rect3:Rectangle = new Rectangle(this.game);
        rect3.size.setWH(40,60);
        rect3.pos.setXY(200,100);
        rect3.setRigidBody(physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.KINEMATIC}));
        this.appendChild(rect3);


        const particle:Rectangle = new Rectangle(this.game);
        particle.size.setWH(5);
        particle.transformPoint.setXY(particle.size.width/2,particle.size.height/2);
        particle.fillColor.setRGBA(133,200,0);
        particle.setRigidBody(physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.DYNAMIC}));

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.emitAuto = false;
        ps.addParticle(particle);
        ps.emissionRadius = 5;
        ps.emissionTarget = this;

        ps.numOfParticlesToEmit = {from:1,to:5};
        ps.particleLiveTime = {from:1000,to:2000};
        ps.particleVelocity = {from: 50, to: 100};
        ps.particleAngle = {from:0,to:2*Math.PI};
        this.appendChild(ps);

        this.on(MOUSE_EVENTS.click,(e)=>{
            ps.emissionPosition.setXY(e.screenX,e.screenY);
            ps.emit();
        });

    }

}
