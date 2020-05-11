import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {DebugError} from "@engine/debug/debugError";

export abstract class AbstractSprite {

    protected renderableImage:RenderableModel;

    protected constructor(protected game: Game, spriteSheet: ResourceLink<ITexture>) {
        this.renderableImage = this.onCreatedRenderableModel(spriteSheet);
        this.onCreatedFrameAnimation();
        this.appendToScene();
    }

    public getRenderableModel():RenderableModel {
        return this.renderableImage;
    }

    protected onCreatedFrameAnimation():void {

    }

    protected createRange(from:number,to:number):number[] {
        if (from>to) throw new DebugError(`can not create range with from=${from} and to=${to}`);
        const arr:number[] = [];
        while (from<=to) {
            arr.push(from++);
        }
        return arr;
    }

    protected onCreatedRenderableModel(spriteSheet: ResourceLink<ITexture>):RenderableModel {
        const img: Image = new Image(this.game);
        img.setResourceLink(spriteSheet);
        return img;
    }

    private appendToScene(){
        this.game.getCurrScene().getLayerAtIndex(1).appendChild(this.renderableImage);
        this.renderableImage.transformPoint.setToCenter();
    }

}
