import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvent";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {MathEx} from "@engine/misc/mathEx";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class MainScene extends Scene {


    public override onReady():void {

        const physicsSystem:ArcadePhysicsSystem = this.game.getPhysicsSystem();

        const rect1:Rectangle = new Rectangle(this.game);
        rect1.pos.setXY(10,10);
        const rigidBody1:ArcadeRigidBody = physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,groupNames:['platform']});
        rect1.setRigidBody(rigidBody1);
        this.appendChild(rect1);

        const rect2:Rectangle = new Rectangle(this.game);
        rect2.size.setWH(500,15);
        rect2.pos.setXY(10,200);
        rect2.setRigidBody(physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.KINEMATIC,groupNames:['platform']}));
        this.appendChild(rect2);

        const rect3:Rectangle = new Rectangle(this.game);
        rect3.size.setWH(40,60);
        rect3.pos.setXY(200,100);
        rect3.setRigidBody(physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.KINEMATIC,groupNames:['platform']}));
        this.appendChild(rect3);


        const particle:Rectangle = new Rectangle(this.game);
        particle.size.setWH(5);
        particle.transformPoint.setXY(particle.size.width/2,particle.size.height/2);
        particle.fillColor.setRGBA(133,200,0);
        particle.setRigidBody(physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.DYNAMIC,groupNames:['particles'],ignoreCollisionWithGroupNames:['particles']}));

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.emitAuto = false;
        ps.maxParticlesInCache = 2000;
        ps.addParticlePrefab(particle);

        ps.emissionRadius = 5;
        ps.numOfParticlesToEmit = { from: 15, to: 20 };
        ps.particleLiveTime = { from: 2000, to: 10000 };
        ps.particleVelocity = { from: 50, to: 100 };
        ps.particleAngle = { from: 0, to: 2 * Math.PI };

        this.appendChild(ps);
        ps.onEmitParticle(p=>{
            const ptcl = p as Rectangle;
            if (MathEx.randomUint8()>128) {
                ptcl.fillColor.setFrom(ColorFactory.fromCSS(`#4fb404`));
            } else {
                ptcl.fillColor.setFrom(ColorFactory.fromCSS(`#ce0000`));
            }
        });

        this.mouseEventHandler.on(MOUSE_EVENTS.click,(e)=>{
            ps.emissionPosition.setXY(e.screenX,e.screenY);
            ps.emitTo(this);
        });

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            if (e.isMouseDown) {
                ps.emissionPosition.setXY(e.screenX,e.screenY);
                ps.emitTo(this);
            }
        });

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e => {

            switch (e.button) {
                case KEYBOARD_KEY.SPACE:
                    if (rigidBody1.collisionFlags.bottom) rigidBody1.velocity.y += -300;
                    break;
                case KEYBOARD_KEY.LEFT:
                    rigidBody1.velocity.x += -50;
                    break;
                case KEYBOARD_KEY.RIGHT:
                    rigidBody1.velocity.x += 50;
                    break;
            }
        });
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e => {
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    rigidBody1.velocity.x = 0;
                    rigidBody1.acceleration.x = 0;
                    break;
            }
        });

    }

}
