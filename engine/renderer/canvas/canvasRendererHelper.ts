import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {Game} from "@engine/core/game";
import {Size} from "@engine/geometry/size";
import {CanvasRenderTarget} from "@engine/renderer/canvas/canvasRenderTarget";

export class CanvasRendererHelper extends RendererHelper {

    override createRenderTarget(game: Game, size: Size): CanvasRenderTarget {
        return new CanvasRenderTarget(game, size);
    }
}
