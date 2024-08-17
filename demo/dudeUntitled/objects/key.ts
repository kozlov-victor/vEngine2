import {Image} from "@engine/renderable/impl/general/image/image";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {MainScene} from "../mainScene";
import {Optional} from "@engine/core/declarations";


export class Key {

    public static NAME = 'Key';

    private image:Image;
    public readonly rectId:Optional<string>;

    constructor(private scene:MainScene,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {


        const image = new Image(scene.getGame(),scene.assets.spritesTexture);
        const atlas = new TexturePackerAtlas(scene.assets.spritesAtlas);
        const frame = atlas.getFrameByKey('key_frame_1');
        image.size.setWH(frame.width,frame.height);
        image.srcRect.setFrom(frame);
        image.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        image.setRigidBody(scene.getGame().getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.STATIC,
            rect: undefined,
            acceptCollisions: false,
            groupNames: ['collectable']
        }));
        image.getRigidBody<ArcadeRigidBody>().addInfo.host = this;
        image.appendTo(scene);
        this.image = image;
        this.rectId = tiledObject.properties?.find(it=>it.name==='rectId')?.value;
    }


}
