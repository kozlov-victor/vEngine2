import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IFilterable} from "@engine/core/declarations";
import {ISize} from "@engine/geometry/size";


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
        renderer.beforeFrameDraw();
        renderer.transformSave();
        renderer.transformTranslate(this.game.camera.pos.x,this.game.camera.pos.y);
        m.render();
        renderer.transformRestore();
        renderer.afterFrameDraw(m.filters);
        renderer.unsetRenderTarget();
        renderer.clearBeforeRender = clearBeforeRenderOrig;
    }
}