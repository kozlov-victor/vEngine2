import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {Game} from "@engine/core/game";
import {ISize} from "@engine/geometry/size";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";

export class DomRendererHelper extends RendererHelper {


    public createRenderTarget(game: Game, size: ISize): IRenderTarget {
        return undefined!;
    }



}
