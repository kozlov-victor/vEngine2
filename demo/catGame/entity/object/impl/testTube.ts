import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {CollectableEntity} from "../abstract/collectableEntity";

export class TestTube extends CollectableEntity {

    public static override readonly groupName:string = 'testTube';

    constructor(game: Game, spriteSheet: ITexture) {
        super(game,spriteSheet,{
            groupNames: [TestTube.groupName,CollectableEntity.groupName],
        });
    }

}
