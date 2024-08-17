import {Image} from "@engine/renderable/impl/general/image/image";
import {ITiledJSON, TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {MainScene} from "../mainScene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {FireEmitter} from "../particles/fireEmitter";
import {DI} from "@engine/core/ioc";

@DI.Injectable()
export class Fire {

    public static NAME = 'Fire';

    private readonly image:Image;

    @DI.Inject(FireEmitter) private readonly fireEmitter:FireEmitter;

    constructor(private scene:MainScene,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {

        const image = new AnimatedImage(scene.getGame(),scene.assets.spritesTexture);
        const atlas = new TexturePackerAtlas(scene.assets.spritesAtlas);
        const animation = new AtlasFrameAnimation(scene.getGame(),{
            frames: [
                atlas.getFrameByKey('fire_fire1'),
                atlas.getFrameByKey('fire_fire2'),
                atlas.getFrameByKey('fire_fire3'),
                atlas.getFrameByKey('fire_fire4'),
                atlas.getFrameByKey('fire_fire5'),
            ],
            durationOfOneFrame: 120
        });
        image.addFrameAnimation(animation);
        animation.play();
        image.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        image.setRigidBody(scene.getGame().getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.STATIC,
            rect: TileMap.getCollisionRect(this.scene.assets.levelData,'fire'),
            acceptCollisions: false,
            groupNames: ['damageable']
        }));
        const body = image.getRigidBody<ArcadeRigidBody>();
        body.addInfo.host = this;
        image.appendTo(scene);
        image.setInterval(()=>{
            this.fireEmitter.emit(body.getMidX(),body.getMidY());
        },100);
        this.image = image;
    }

    public getRenderable():RenderableModel {
        return this.image;
    }


}
