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

const TRANSPARENT = Color.RGB(0,0,0,0);

export class WebGlRendererHelper extends RendererHelper {

    private frameBuffers:FastMap<any,FrameBuffer> = new FastMap();

    public renderSceneToTexture(scene:Scene): ResourceLink<ITexture> {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        let fb:FrameBuffer = this.frameBuffers.get(scene)!;
        if (fb===undefined) {
            fb = new FrameBuffer(renderer.getNativeContext(),scene.size.width,scene.size.height);
            this.frameBuffers.put(scene,fb);
        }
        renderer.setRenderTarget(fb);
        scene.render();
        renderer.unsetRenderTarget();
        const link:ResourceLink<ITexture> = ResourceLink.create<ITexture>();
        link.setTarget(fb.getTexture());
        (this.game.getRenderer() as WebGlRenderer).putToCache(link,fb.getTexture());
        return link;
    }

    public renderRenderableModelToTexture(m: RenderableModel & IFilterable): ResourceLink<ITexture> {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        let fb:FrameBuffer = this.frameBuffers.get(m)!;
        if (fb===undefined) {
            fb = new FrameBuffer(renderer.getNativeContext(),m.size.width,m.size.height);
            this.frameBuffers.put(m,fb);
        }
        renderer.setRenderTarget(fb);
        renderer.beforeFrameDraw(TRANSPARENT);
        m.render();
        renderer.afterFrameDraw(m.filters);
        renderer.unsetRenderTarget();
        const link:ResourceLink<ITexture> = ResourceLink.create<ITexture>();
        link.setTarget(fb.getTexture());
        (this.game.getRenderer() as WebGlRenderer).putToCache(link,fb.getTexture());
        return link;
    }
}