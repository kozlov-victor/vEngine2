
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {AbstractEntity} from "../../abstract/abstractEntity";
import {CollectableEntity} from "../abstract/collectableEntity";

export class TestTube extends CollectableEntity {

    public static readonly groupName:string = 'testTube';

    constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>) {
        super(game,spriteSheet,{
            groupNames: [TestTube.groupName,CollectableEntity.groupName],
        });
    }

}
