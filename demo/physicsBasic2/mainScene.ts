import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Camera} from "@engine/renderer/camera";
import * as docDesc from "./level.xml";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Document} from "@engine/misc/xmlUtils";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Size} from "@engine/geometry/size";

export class MainScene extends Scene {


    private player: Rectangle;

    public onReady() {

        Camera.FOLLOW_FACTOR.y = 0.06;

        const physicsSystem: ArcadePhysicsSystem = this.game.getPhysicsSystem() as ArcadePhysicsSystem;

        const rect1: Rectangle = new Rectangle(this.game);
        rect1.pos.setXY(10, 10);
        const rigidBody1: ArcadeRigidBody = physicsSystem.createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.DYNAMIC,
            restitution: 0.01,
        });
        rect1.setRigidBody(rigidBody1);
        this.appendChild(rect1);
        this.player = rect1;


        this.on(KEYBOARD_EVENTS.keyPressed, e => {

            switch (e.key) {
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
        this.on(KEYBOARD_EVENTS.keyReleased, e => {
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    rigidBody1.velocity.x = 0;
                    rigidBody1.acceleration.x = 0;
                    break;
            }
        });

        this.size.setWH(800, 600);
        this.game.camera.followTo(rect1);

        const document:Document = Document.create(docDesc);
        document.getElementsByTagName('rect').forEach(c=>{
            const rect: Rectangle = new Rectangle(this.game);
            rect.pos.setXY(+c.attributes.x, +c.attributes.y);
            rect.size.setWH(+c.attributes.width, +c.attributes.height);
            rect.fillColor = Color.fromRGBNumeric(parseInt(c.attributes.fill.replace('#', ''), 16));
            rect.addBehaviour(new DraggableBehaviour(this.game));
            const rigidBody: ArcadeRigidBody = physicsSystem.createRigidBody({type:ARCADE_RIGID_BODY_TYPE.KINEMATIC});
            rect.setRigidBody(rigidBody);
            this.appendChild(rect);
        });

        const particle:Rectangle = new Rectangle(this.game);
        particle.size.setWH(5);
        particle.transformPoint.setXY(particle.size.width/2,particle.size.height/2);
        particle.fillColor.setRGBA(133,200,0);
        particle.setRigidBody(physicsSystem.createRigidBody({type: ARCADE_RIGID_BODY_TYPE.DYNAMIC}));

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.emitAuto = false;
        ps.addParticle(particle);
        ps.emissionRadius = 5;
        ps.forceDrawChildrenOnNewSurface = true;

        ps.numOfParticlesToEmit = {from:1,to:5};
        ps.particleLiveTime = {from:1000,to:2000};
        ps.particleVelocity = {from: 50, to: 100};
        ps.particleAngle = {from:0,to:2*Math.PI};
        ps.emissionTarget = this;
        this.appendChild(ps);

        this.on(MOUSE_EVENTS.click,(e)=>{
            ps.emissionPosition.setXY(e.sceneX,e.sceneY);
            ps.emit();
        });

    }

    protected onUpdate(): void {
        if (this.player.pos.y > this.size.height + 300) this.game.runScene(new MainScene(this.game));
    }
}
