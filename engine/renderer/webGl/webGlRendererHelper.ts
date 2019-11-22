import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Scene} from "@engine/scene/scene";
import {FastMap} from "@engine/misc/collection/fastMap";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {IFilterable} from "@engine/core/declarations";
import {ISize} from "@engine/geometry/size";

const TRANSPARENT = Color.RGB(0,0,0,0);

export class WebGlRendererHelper extends RendererHelper {


    public createRenderTarget(size: ISize): FrameBuffer {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        return new FrameBuffer(renderer.getNativeContext(),size);
    }

    public renderSceneToTexture(scene:Scene,renderTarget:FrameBuffer): void {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        renderer.setRenderTarget(renderTarget);
        scene.render();
        renderer.unsetRenderTarget();
    }

    public renderRenderableModelToTexture(m: RenderableModel & IFilterable,renderTarget:FrameBuffer): void {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        if (m.size.isZero()) m.revalidate();
        renderer.setRenderTarget(renderTarget);
        const clearBeforeRenderOrig:boolean = renderer.clearBeforeRender;
        renderer.clearBeforeRender = false;
        renderer.beforeFrameDraw();
        m.render();
        renderer.afterFrameDraw(m.filters);
        renderer.unsetRenderTarget();
        renderer.clearBeforeRender = clearBeforeRenderOrig;
    }
}