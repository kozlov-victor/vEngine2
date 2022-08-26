import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {DomRenderTarget} from "@engine/renderer/dom/domRenderTarget";

export class DomRendererHelper extends RendererHelper {


    public createRenderTarget(game: Game, size: ISize): IRenderTarget {
        return new DomRenderTarget(game,size);
    }



}
