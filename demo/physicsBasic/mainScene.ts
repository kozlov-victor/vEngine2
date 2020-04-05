import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {ArcadeRigidBody, PHYSICS_MODEL_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Camera} from "@engine/renderer/camera";

export class MainScene extends Scene {



    public onReady() {

        Camera.FOLLOW_FACTOR.y = 0;

        const physicsSystem:ArcadePhysicsSystem = this.game.getPhysicsSystem() as ArcadePhysicsSystem;

        const rect1:Rectangle = new Rectangle(this.game);
        rect1.pos.setXY(10,10);
        const rigidBody1:ArcadeRigidBody = physicsSystem.createRigidBody(rect1);
        rect1.rigidBody = rigidBody1;
        this.appendChild(rect1);

        const rect2:Rectangle = new Rectangle(this.game);
        rect2.size.setWH(500,15);
        rect2.pos.setXY(10,200);
        const rigidBody2:ArcadeRigidBody = physicsSystem.createRigidBody(rect2);
        rigidBody2.modelType = PHYSICS_MODEL_TYPE.KINEMATIC;
        rect2.rigidBody = rigidBody2;
        this.appendChild(rect2);

        const rect3:Rectangle = new Rectangle(this.game);
        rect3.size.setWH(40,60);
        rect3.pos.setXY(200,100);
        const rigidBody3:ArcadeRigidBody = physicsSystem.createRigidBody(rect3);
        rigidBody3.modelType = PHYSICS_MODEL_TYPE.KINEMATIC;
        rect3.rigidBody = rigidBody3;
        this.appendChild(rect3);


        this.on(KEYBOARD_EVENTS.keyPressed, e=>{
            switch (e.key) {
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
        this.on(KEYBOARD_EVENTS.keyReleased,e=>{
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    rigidBody1.velocity.x = 0;
                    rigidBody1.acceleration.x = 0;
                    break;
            }
        });

        this.size.setWH(500,500);
        this.game.camera.followTo(rect1);

        // this.setInterval(()=>{
        //     if (
        //         rigidBody1.collisionFlags.left ||
        //         rigidBody1.collisionFlags.right ||
        //         rigidBody1.collisionFlags.top ||
        //         rigidBody1.collisionFlags.bottom
        //     ) console.log(rigidBody1.collisionFlags);
        // },1);



    }

}
