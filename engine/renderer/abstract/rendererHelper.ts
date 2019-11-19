import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class RendererHelper {

    public constructor(protected game:Game){}

    public renderSceneToTexture(scene:Scene):ResourceLink<ITexture> {
        return ResourceLink.create();
    }

    public renderRenderableModelToTexture(m:RenderableModel):ResourceLink<ITexture> {
        return ResourceLink.create();
    }


}