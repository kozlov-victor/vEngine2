import {Image} from "@engine/renderable/impl/general/image/image";
import {ITileCollisionRect, ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {MainScene} from "../mainScene";


export class Candy {

    private image:Image;

    public type = 'Candy' as const;

    constructor(private scene:MainScene,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {

        const objGroup =
            scene.assets.levelData.tilesets.find(it=>it.name==='Candy')?.
            tiles?.find((it=>(it as ITileCollisionRect).objectgroup!==undefined));
        const rect = (objGroup as ITileCollisionRect)?.objectgroup?.objects?.[0];

        const image = new Image(scene.getGame(),scene.assets.inventoryTexture);
        const atlas = new TexturePackerAtlas(scene.assets.inventoryAtlas);
        const frame = atlas.getFrameByKey('candy');
        image.size.setWH(frame.width,frame.height);
        image.srcRect.setFrom(frame);
        image.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        image.setRigidBody(scene.getGame().getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            rect,
            acceptCollisions: false,
            groupNames: ['collectable']
        }));
        image.getRigidBody<ArcadeRigidBody>().addInfo.host = this;
        image.appendTo(scene);
        this.image = image;
    }


}
