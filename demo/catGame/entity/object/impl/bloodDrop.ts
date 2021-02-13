
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {AbstractEntity} from "../../abstract/abstractEntity";
import {CollectableEntity} from "../abstract/collectableEntity";

export class BloodDrop extends CollectableEntity {

    public static readonly groupName:string = 'bloodDrop';

    constructor(protected game: Game, spriteSheet: ITexture) {
        super(game,spriteSheet,{
            groupNames: [BloodDrop.groupName,CollectableEntity.groupName],
        });
    }

}
