import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {CollectableEntity} from "../abstract/collectableEntity";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";

export class TestTube extends CollectableEntity {

    public static override readonly groupName:string = 'testTube';

    constructor(game: Game, spriteSheet: ITexture) {
        super(game,spriteSheet,{
            groupNames: [TestTube.groupName,CollectableEntity.groupName],
        });
    }

}
