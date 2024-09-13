import {Image} from "@engine/renderable/impl/general/image/image";
import {MainScene} from "../mainScene";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_COLLISION_EVENTS, ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {BumpRect} from "./bumpRect";

export class PlatformMoveable {

    public static NAME = 'PlatformMoveable';

    private lastBumped:BumpRect;

    constructor(private scene:MainScene,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {

        const game = scene.getGame();

        const atlas = new TexturePackerAtlas(scene.assets.spritesAtlas);
        const platformFrame = atlas.getFrameByKey('platform_moveable_frame_1');
        const container = new SimpleGameObjectContainer(game);
        container.size.setFrom(platformFrame);

        const rigidBody = scene.getGame().getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            rect: undefined,
        })

        container.setRigidBody(rigidBody);
        container.getRigidBody<ArcadeRigidBody>().addInfo.host = this;
        container.appendTo(scene);
        container.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        rigidBody.velocity.y = -20;
        rigidBody.collisionEventHandler.on(ARCADE_COLLISION_EVENTS.OVERLAPPED, e=>{
            if (e.addInfo?.host?.constructor?.name===BumpRect.name) {
                const bumper = e.addInfo.host as BumpRect;
                if (this.lastBumped!==bumper) {
                    rigidBody.velocity.y = -rigidBody.velocity.y;
                    wheel.angleVelocity = -wheel.angleVelocity;
                }
                this.lastBumped = bumper;
            }
        });


        const image = new Image(scene.getGame(),scene.assets.spritesTexture);
        image.size.setWH(platformFrame.width,platformFrame.height);
        image.srcRect.setFrom(platformFrame);
        image.appendTo(container);

        const wheel = new Image(scene.getGame(),scene.assets.spritesTexture);
        wheel.srcRect.setFrom(atlas.getFrameByKey('platform_wheel_frame_1'));
        wheel.size.setFrom(wheel.srcRect);
        wheel.prependTo(container);
        wheel.transformPoint.setToCenter();
        wheel.pos.setXY(5,-12);
        wheel.angleVelocity = 2;

    }

}
