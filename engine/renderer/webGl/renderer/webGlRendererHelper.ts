import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {ISize} from "@engine/geometry/size";
import {Game} from "@engine/core/game";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {FrameBufferStack} from "@engine/renderer/webGl/base/buffer/frameBufferStack";


export class WebGlRendererHelper extends RendererHelper {

    public createRenderTarget(game:Game,size: ISize): FrameBufferStack {
        const renderer = this.game.getRenderer() as WebGlRenderer;
        return new FrameBufferStack(game,renderer.getNativeContext(),size);
    }

    public destroyRenderTarget(t: IRenderTarget): void {

    }

}
