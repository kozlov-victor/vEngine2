import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Scene} from "@engine/scene/scene";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IFilterable} from "@engine/core/declarations";
import {ISize} from "@engine/geometry/size";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";


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

    public renderRenderableModelToTexture(m: RenderableModel & IFilterable,renderTarget:FrameBuffer,clearBeforeRender:boolean): void {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        if (m.size.isZero()) m.revalidate();
        renderer.setRenderTarget(renderTarget);
        const clearBeforeRenderOrig:boolean = renderer.clearBeforeRender;
        renderer.clearBeforeRender = clearBeforeRender;
        const statePointer:IStateStackPointer = renderer.beforeFrameDraw(m.filters as AbstractGlFilter[],BLEND_MODE.NORMAL);
        renderer.transformTranslate(this.game.camera.pos.x,this.game.camera.pos.y);
        m.render();
        renderer.afterFrameDraw(statePointer);
        renderer.unsetRenderTarget();
        renderer.clearBeforeRender = clearBeforeRenderOrig;
    }
}