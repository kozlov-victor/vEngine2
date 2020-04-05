import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {ArcadeRigidBody, PHYSICS_MODEL_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Camera} from "@engine/renderer/camera";
import * as doc from "./level.xml";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {


    private player: Rectangle;

    public onReady() {

        Camera.FOLLOW_FACTOR.y = 0.06;

        const physicsSystem: ArcadePhysicsSystem = this.game.getPhysicsSystem() as ArcadePhysicsSystem;

        const rect1: Rectangle = new Rectangle(this.game);
        rect1.pos.setXY(10, 10);
        const rigidBody1: ArcadeRigidBody = physicsSystem.createRigidBody(rect1);
        rect1.rigidBody = rigidBody1;
        this.appendChild(rect1);
        rigidBody1.restitution = 0.01;
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

        doc.children[0].children.forEach(c => {
            const rect: Rectangle = new Rectangle(this.game);
            rect.pos.setXY(+c.attributes.x, +c.attributes.y);
            rect.size.setWH(+c.attributes.width, +c.attributes.height);
            rect.fillColor = Color.fromRGBNumeric(parseInt(c.attributes.fill.replace('#', ''), 16));
            rect.addBehaviour(new DraggableBehaviour(this.game));
            const rigidBody: ArcadeRigidBody = physicsSystem.createRigidBody(rect);
            rigidBody.modelType = PHYSICS_MODEL_TYPE.KINEMATIC;
            rect.rigidBody = rigidBody;
            this.appendChild(rect);
        });

    }

    protected onUpdate(): void {
        if (this.player.pos.y > this.size.height + 300) this.game.runScene(new MainScene(this.game));
    }
}
