import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {CollectableEntity} from "../abstract/collectableEntity";

export class BloodDrop extends CollectableEntity {

    public static override readonly groupName:string = 'bloodDrop';

    constructor(game: Game, spriteSheet: ITexture) {
        super(game,spriteSheet,{
            groupNames: [BloodDrop.groupName,CollectableEntity.groupName],
        });
    }

}
