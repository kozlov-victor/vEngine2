import {AbstractObject} from "../abstract/abstractObject";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";

export class BloodDrop extends AbstractObject {

    public static readonly groupName:string = 'bloodDrop';

    constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>) {
        super(game,spriteSheet);
        this.createRigidBody({
            groupNames: [BloodDrop.groupName,AbstractObject.collectableGroupName],
        });
    }

}
