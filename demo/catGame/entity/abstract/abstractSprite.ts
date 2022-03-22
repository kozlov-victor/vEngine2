import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image/image";
import {DebugError} from "@engine/debug/debugError";

export abstract class AbstractSprite {

    protected renderableImage:RenderableModel;

    protected constructor(protected game: Game, spriteSheet: ITexture) {
        this.renderableImage = this.onCreatedRenderableModel(spriteSheet);
        this.onCreatedFrameAnimation();
        this.appendToScene();
    }

    public getRenderableModel():RenderableModel {
        return this.renderableImage;
    }

    protected onCreatedFrameAnimation():void {

    }

    protected onCreatedRenderableModel(spriteSheet: ITexture):RenderableModel {
        return new Image(this.game, spriteSheet);
    }

    private appendToScene():void{
        this.game.getCurrentScene().getLayerAtIndex(1).appendChild(this.renderableImage);
        this.renderableImage.transformPoint.setToCenter();
    }

}
