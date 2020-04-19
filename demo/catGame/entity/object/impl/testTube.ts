import {AbstractObject} from "../abstract/abstractObject";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";

export class TestTube extends AbstractObject {

    public static readonly groupName:string = 'testTube';

    constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>) {
        super(game,spriteSheet);
        this.createRigidBody({
            groupNames: [TestTube.groupName,AbstractObject.collectableGroupName],
        });
    }

}
