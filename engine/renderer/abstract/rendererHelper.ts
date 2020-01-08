import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {ISize} from "@engine/geometry/size";

export class RendererHelper {

    public constructor(protected game:Game){}

    public renderSceneToTexture(scene:Scene,renderTarget:IRenderTarget):void {
        return undefined!;
    }

    public renderModelToTexture(m:RenderableModel, renderTarget:IRenderTarget, clearBeforeRender:boolean):void {
        return undefined!;
    }

    public createRenderTarget(game:Game,size:ISize):IRenderTarget{
        return undefined!;
    }

    public destroyRenderTarget(t:IRenderTarget){}


}