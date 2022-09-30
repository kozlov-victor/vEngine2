import {Image} from "@engine/renderable/impl/general/image/image";
import {Assets} from "../assets/assets";
import {ITileCollisionRect, ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Game} from "@engine/core/game";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {Scene} from "@engine/scene/scene";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";

export class Sausage {

    private image:Image;

    constructor(private game:Game,scene:Scene,private assets:Assets,tiledObject:ITiledJSON['layers'][0]['objects'][0]) {

        const objGroup =
            assets.levelData.tilesets.find(it=>it.name==='inventory')!.
            tiles?.find((it=>(it as ITileCollisionRect).objectgroup!==undefined)) as ITileCollisionRect;
        const rect = objGroup.objectgroup.objects[0];

        const image = new Image(game,assets.inventoryTexture);
        const atlas = new TexturePackerAtlas(assets.inventoryAtlas);
        const frame = atlas.getFrameByKey('inventory_sausage');
        image.size.setWH(frame.width,frame.height);
        image.srcRect.setFrom(frame);
        image.pos.setXY(tiledObject.x,tiledObject.y - tiledObject.height);
        image.setRigidBody(this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
            type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
            rect,
            acceptCollisions: false,
            groupNames: ['collectable']
        }));
        image.appendTo(scene);
        this.image = image;
    }

}
