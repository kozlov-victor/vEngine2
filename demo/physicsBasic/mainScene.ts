import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Camera} from "@engine/renderer/camera";

export class MainScene extends Scene {



    public override onReady():void {

        Camera.FOLLOW_FACTOR.y = 0;

        const physicsSystem:ArcadePhysicsSystem = this.game.getPhysicsSystem();

        const rect1:Rectangle = new Rectangle(this.game);
        rect1.pos.setXY(10,10);
        const rigidBody1:ArcadeRigidBody = physicsSystem.createRigidBody();
        rect1.setRigidBody(rigidBody1);
        this.appendChild(rect1);

        const rect2:Rectangle = new Rectangle(this.game);
        rect2.size.setWH(500,15);
        rect2.pos.setXY(10,200);
        rect2.setRigidBody(physicsSystem.createRigidBody({type: ARCADE_RIGID_BODY_TYPE.KINEMATIC}));
        this.appendChild(rect2);

        const rect3:Rectangle = new Rectangle(this.game);
        rect3.size.setWH(40,60);
        rect3.pos.setXY(200,100);
        const rigidBody3:ArcadeRigidBody = physicsSystem.createRigidBody({type: ARCADE_RIGID_BODY_TYPE.KINEMATIC});
        rect3.setRigidBody(rigidBody3);
        this.appendChild(rect3);


        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.button) {
                case KEYBOARD_KEY.SPACE:
                    if (rigidBody1.collisionFlags.bottom) rigidBody1.velocity.y+=-200;
                    break;
                case KEYBOARD_KEY.LEFT:
                    rigidBody1.velocity.x+=-50;
                    break;
                case KEYBOARD_KEY.RIGHT:
                    rigidBody1.velocity.x+=50;
                    break;
            }
        });
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased,e=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    rigidBody1.velocity.x = 0;
                    rigidBody1.acceleration.x = 0;
                    break;
            }
        });

        this.size.setWH(500,500);
        this.camera.followTo(rect1);

    }

}
