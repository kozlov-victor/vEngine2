import {AbstractSprite} from "../abstract/abstractSprite";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";

export class GenericSprite extends AbstractSprite {


    public constructor(game: Game, spriteSheet: ITexture) {
        super(game, spriteSheet);
    }
}
