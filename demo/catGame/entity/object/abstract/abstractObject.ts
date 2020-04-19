import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {AbstractEntity} from "../../abstract/abstractEntity";
import {Image} from "@engine/renderable/impl/general/image";

export abstract class AbstractObject extends AbstractEntity {

    public static readonly collectableGroupName:string = 'collectable';

    protected constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>) {
        super(game);
        const img: Image = new Image(this.game);
        img.setResourceLink(spriteSheet);
        this.game.getCurrScene().appendChild(img);
        this.renderableImage = img;
    }

}


