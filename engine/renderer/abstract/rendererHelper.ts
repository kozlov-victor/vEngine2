import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {ISize} from "@engine/geometry/size";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";

export class RendererHelper {

    public constructor(protected game:Game){}

    public renderSceneToTexture(scene:Scene,renderTarget:IRenderTarget):void {
        return undefined!;
    }

    public renderRenderableModelToTexture(m:RenderableModel,renderTarget:IRenderTarget,clearBeforeRender:boolean):void {
        return undefined!;
    }

    public createRenderTarget(size:ISize):IRenderTarget{
        return undefined!;
    }

    public destroyRenderTarget(t:IRenderTarget){}


}