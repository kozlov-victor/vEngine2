import {MainScene} from "../mainScene";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Image} from "@engine/renderable/impl/general/image/image";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";

export class FirePowerup {

    private readonly image:Image;

    constructor(private scene:MainScene,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {
        const image = new AnimatedImage(scene.getGame(),scene.assets.spritesTexture);
        const atlas = new TexturePackerAtlas(scene.assets.spritesAtlas);
        const animation = new AtlasFrameAnimation(scene.getGame(),{
            frames: [
                atlas.getFrameByKey('fire_powerup_frame1'),
                atlas.getFrameByKey('fire_powerup_frame2'),
            ],
            durationOfOneFrame: 115,
        });
        image.addFrameAnimation(animation);
        animation.play();
        image.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        image.setRigidBody(scene.getGame().getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            rect: undefined,
            acceptCollisions: false,
            groupNames: ['collectable']
        }));
        const body = image.getRigidBody<ArcadeRigidBody>();
        body.addInfo.host = this;
        image.appendTo(scene);
        this.image = image;
    }

}
