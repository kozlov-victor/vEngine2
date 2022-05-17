import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ISize} from "@engine/geometry/size";
import {FrameBufferStack} from "@engine/renderer/webGl/base/frameBufferStack";
import {Mat4} from "@engine/misc/math/mat4";
import {MatrixStack} from "@engine/misc/math/matrixStack";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {LruMap} from "@engine/misc/collection/lruMap";
import {Stack} from "@engine/misc/collection/stack";
import Mat16Holder = Mat4.Mat16Holder;
import IDENTITY_HOLDER = Mat4.IDENTITY_HOLDER;


export class WebGlRendererHelper extends RendererHelper {

    private renderTargetStack:Stack<FrameBufferStack> = new Stack<FrameBufferStack>();

    public override createRenderTarget(game:Game,size: ISize): FrameBufferStack {
        const renderer:WebGlRenderer = this.game.getRenderer();
        return new FrameBufferStack(game,renderer.getNativeContext(),size);
    }

    public override saveRenderTarget():void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        this.renderTargetStack.push(renderer.getRenderTarget());
    }

    public override restoreRenderTarget():void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        renderer.setRenderTarget(this.renderTargetStack.pop()!);
    }

    public override renderSceneToTexture(scene:Scene,renderTarget:FrameBufferStack): void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        this.saveRenderTarget();
        renderer.setRenderTarget(renderTarget);
        scene.render();
        this.restoreRenderTarget();
    }

    public override renderModelToTexture(m: RenderableModel, renderTarget:FrameBufferStack, clear:boolean = false): void {
        const renderer:WebGlRenderer = this.game.getRenderer();
        if (m.size.isZero()) m.revalidate();
        const currRenderTarget = this.game.getRenderer<WebGlRenderer>().getRenderTarget();
        const needSave = currRenderTarget!==renderTarget;
        if (needSave) this.saveRenderTarget();
        renderer.setRenderTarget(renderTarget);
        renderer.transformSave();
        renderer.transformSet(IDENTITY_HOLDER);
        if (clear) renderTarget.clear(Color.NONE,0);
        m.render();
        if (needSave) this.restoreRenderTarget();
        renderer.transformRestore();
    }
}
