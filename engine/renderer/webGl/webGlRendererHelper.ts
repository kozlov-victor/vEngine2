import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ISize} from "@engine/geometry/size";
import {FrameBufferStack, IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {mat4} from "@engine/geometry/mat4";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {Game} from "@engine/core/game";
import Mat16Holder = mat4.Mat16Holder;

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

    public createRenderTarget(game:Game,size: ISize): FrameBufferStack {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        return new FrameBufferStack(game,renderer.getNativeContext(),size);
    }

    public renderSceneToTexture(scene:Scene,renderTarget:FrameBufferStack): void {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        renderer.setRenderTarget(renderTarget);
        scene.render();
        renderer.setDefaultRenderTarget();
    }

    public renderModelToTexture(m: RenderableModel, renderTarget:FrameBufferStack, clearBeforeRender:boolean): void {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        if (m.size.isZero()) m.revalidate();
        renderer.setRenderTarget(renderTarget);
        const clearBeforeRenderOrig:boolean = renderer.clearBeforeRender;
        renderer.clearBeforeRender = clearBeforeRender;
        const statePointer:IStateStackPointer = renderer.beforeFrameDraw(m.filters as AbstractGlFilter[]);
        //renderer.transformTranslate(this.game.camera.pos.x,this.game.camera.pos.y);
        m.render();
        renderer.afterFrameDraw(statePointer);
        renderer.setDefaultRenderTarget();
        renderer.clearBeforeRender = clearBeforeRenderOrig;
    }
}