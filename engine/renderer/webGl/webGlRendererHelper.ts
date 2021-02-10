import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ISize} from "@engine/geometry/size";
import {FrameBufferStack, IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Mat4} from "@engine/geometry/mat4";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {Game} from "@engine/core/game";
import Mat16Holder = Mat4.Mat16Holder;
import {Color} from "@engine/renderer/common/color";
import {LruMap} from "@engine/misc/collection/lruMap";
import IDENTITY = Mat4.IDENTITY;
import {Stack} from "@engine/misc/collection/stack";

const identityPositionMatrixCache:LruMap<string, Mat16Holder> = new LruMap<string, Mat4.Mat16Holder>();

export const makeIdentityPositionMatrix = (dstX:number,dstY:number,destSize:ISize):Mat16Holder =>{
    const key:string = `${dstX}_${dstY}_${destSize.width}_${destSize.height}`;
    if (identityPositionMatrixCache.has(key)) return identityPositionMatrixCache.get(key)!;
    const projectionMatrix:Mat16Holder = Mat16Holder.create();
    const dstWidth:number = destSize.width;
    const dstHeight:number = destSize.height;
    Mat4.ortho(projectionMatrix,0,dstWidth,0,dstHeight,-1,1);
    const scaleMatrix:Mat16Holder = Mat16Holder.create();
    Mat4.makeScale(scaleMatrix,dstWidth, dstHeight, 1);
    const result:Mat16Holder = Mat16Holder.create();
    Mat4.matrixMultiply(result,scaleMatrix, projectionMatrix);
    identityPositionMatrixCache.put(key,result);
    return result;
};

export const FLIP_TEXTURE_MATRIX:Mat16Holder = new MatrixStack().translate(0,1).scale(1,-1).release().getCurrentValue().clone();

export class WebGlRendererHelper extends RendererHelper {

    private renderTargetStack:Stack<FrameBufferStack> = new Stack<FrameBufferStack>();

    public createRenderTarget(game:Game,size: ISize): FrameBufferStack {
        const renderer:WebGlRenderer = this.game.getRenderer();
        return new FrameBufferStack(game,renderer.getNativeContext(),size);
    }

    public saveRenderTarget():void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        this.renderTargetStack.push(renderer.getRenderTarget());
    }

    public restoreRenderTarget():void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        renderer.setRenderTarget(this.renderTargetStack.pop()!);
    }

    public renderSceneToTexture(scene:Scene,renderTarget:FrameBufferStack): void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        this.saveRenderTarget();
        renderer.setRenderTarget(renderTarget);
        renderer.saveAlphaBlend();
        renderer.setAlphaBlend(1);
        scene.render();
        this.restoreRenderTarget();
        renderer.restoreAlphaBlend();
    }

    public renderModelToTexture(m: RenderableModel, renderTarget:FrameBufferStack, clearColor?:Color,omitSaveAndResoreRenderTaget?:boolean): void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        if (m.size.isZero()) m.revalidate();
        if (!omitSaveAndResoreRenderTaget) this.saveRenderTarget();
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
        if (!omitSaveAndResoreRenderTaget) this.restoreRenderTarget();
        renderer.clearBeforeRender = clearBeforeRenderOrig;
        renderer.clearColor.set(clearColorOrig);
        renderer.transformRestore();
        renderer.restoreAlphaBlend();
    }
}
