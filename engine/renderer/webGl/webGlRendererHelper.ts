import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Scene} from "@engine/scene/scene";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IFilterable} from "@engine/core/declarations";
import {ISize} from "@engine/geometry/size";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";

export const makeIdentityPositionMatrix = (dstX:number,dstY:number,destSize:ISize):Mat16Holder =>{
    const projectionMatrix:Mat16Holder = Mat16Holder.fromPool();
    const dstWidth:number = destSize.width;
    const dstHeight:number = destSize.height;
    mat4.ortho(projectionMatrix,0,dstWidth,0,dstHeight,-1,1);
    const scaleMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.makeScale(scaleMatrix,dstWidth, dstHeight, 1);
    const result:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(result,scaleMatrix, projectionMatrix);
    projectionMatrix.release();
    scaleMatrix.release();
    return result;
};

export const FLIP_TEXTURE_MATRIX:Mat16Holder = new MatrixStack().translate(0,1).scale(1,-1).release().getCurrentValue().clone();

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