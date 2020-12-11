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
import {Color} from "@engine/renderer/common/color";
import {LruMap} from "@engine/misc/collection/lruMap";
import IDENTITY = mat4.IDENTITY;

const identityPositionMatrixCache:LruMap<string, Mat16Holder> = new LruMap<string, mat4.Mat16Holder>();

export const makeIdentityPositionMatrix = (dstX:number,dstY:number,destSize:ISize):Mat16Holder =>{
    const key:string = `${dstX}_${dstY}_${destSize.width}_${destSize.height}`;
    if (identityPositionMatrixCache.has(key)) return identityPositionMatrixCache.get(key)!;
    const projectionMatrix:Mat16Holder = Mat16Holder.create();
    const dstWidth:number = destSize.width;
    const dstHeight:number = destSize.height;
    mat4.ortho(projectionMatrix,0,dstWidth,0,dstHeight,-1,1);
    const scaleMatrix:Mat16Holder = Mat16Holder.create();
    mat4.makeScale(scaleMatrix,dstWidth, dstHeight, 1);
    const result:Mat16Holder = Mat16Holder.create();
    mat4.matrixMultiply(result,scaleMatrix, projectionMatrix);
    identityPositionMatrixCache.put(key,result);
    return result;
};

export const FLIP_TEXTURE_MATRIX:Mat16Holder = new MatrixStack().translate(0,1).scale(1,-1).release().getCurrentValue().clone();

export class WebGlRendererHelper extends RendererHelper {

    public createRenderTarget(game:Game,size: ISize): FrameBufferStack {
        const renderer:WebGlRenderer = this.game.getRenderer();
        return new FrameBufferStack(game,renderer.getNativeContext(),size);
    }

    public renderSceneToTexture(scene:Scene,renderTarget:FrameBufferStack): void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        const currRenderTarget:FrameBufferStack = renderer.getRenderTarget();
        renderer.setRenderTarget(renderTarget);
        renderer.saveAlphaBlend();
        renderer.setAlphaBlend(1);
        scene.render();
        renderer.setRenderTarget(currRenderTarget);
        renderer.restoreAlphaBlend();
    }

    public renderModelToTexture(m: RenderableModel, renderTarget:FrameBufferStack, clearColor?:Color): void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        if (m.size.isZero()) m.revalidate();
        const currRenderTarget:FrameBufferStack = renderer.getRenderTarget();
        renderer.setRenderTarget(renderTarget);
        renderer.transformSave();
        renderer.transformSet(IDENTITY);
        renderer.saveAlphaBlend();
        renderer.setAlphaBlend(1);
        const clearBeforeRenderOrig:boolean = renderer.clearBeforeRender;
        const clearColorOrig:Color = renderer.clearColor;
        renderer.clearBeforeRender = clearColor!==undefined;
        if (clearColor!==undefined) renderer.clearColor.set(clearColor);
        const statePointer:IStateStackPointer = renderer.beforeFrameDraw(m.filters as AbstractGlFilter[]);
        m.render();
        renderer.afterFrameDraw(statePointer);
        renderer.setRenderTarget(currRenderTarget);
        renderer.clearBeforeRender = clearBeforeRenderOrig;
        renderer.clearColor.set(clearColorOrig);
        renderer.transformRestore();
        renderer.restoreAlphaBlend();
    }
}
