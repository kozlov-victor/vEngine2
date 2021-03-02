import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {CollectableEntity} from "../abstract/collectableEntity";

export class BloodDrop extends CollectableEntity {

    public static readonly groupName:string = 'bloodDrop';

    constructor(protected game: Game, spriteSheet: ITexture) {
        super(game,spriteSheet,{
            groupNames: [BloodDrop.groupName,CollectableEntity.groupName],
        });
    }

}
