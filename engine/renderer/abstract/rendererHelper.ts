import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {ISize} from "@engine/geometry/size";
import {Color} from "@engine/renderer/common/color";
import {Stack} from "@engine/misc/collection/stack";
import {Mat4} from "@engine/misc/math/mat4";
import IDENTITY_HOLDER = Mat4.IDENTITY_HOLDER;

export abstract class RendererHelper {

    public constructor(protected game: Game) {
    }

    private renderTargetStack = new Stack<IRenderTarget>();

    public saveRenderTarget(): void {
        const renderer = this.game.getRenderer();
        this.renderTargetStack.push(renderer.getRenderTarget());
    }

    public restoreRenderTarget(): void {
        const renderer = this.game.getRenderer();
        renderer.setRenderTarget(this.renderTargetStack.pop()!);
    }

    public renderSceneToTexture(scene: Scene, renderTarget: IRenderTarget): void {
        const renderer = this.game.getRenderer();
        this.saveRenderTarget();
        renderer.setRenderTarget(renderTarget);
        scene.render();
        this.restoreRenderTarget();
    }

    public renderModelToTexture(m: RenderableModel, renderTarget: IRenderTarget, clear: boolean = false): void {
        const renderer = this.game.getRenderer();
        if (m.size.isZero()) m.revalidate();
        const currRenderTarget = renderer.getRenderTarget();
        const needSave = currRenderTarget !== renderTarget;
        if (needSave) this.saveRenderTarget();
        renderer.setRenderTarget(renderTarget);
        renderer.transformSave();
        renderer.transformSet(IDENTITY_HOLDER);
        if (clear) renderTarget.clear(Color.NONE, true, 0);
        m.render();
        if (needSave) this.restoreRenderTarget();
        renderer.transformRestore();
    }

    public abstract createRenderTarget(game: Game, size: ISize): IRenderTarget;

}


