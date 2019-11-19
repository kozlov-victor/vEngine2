import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Scene} from "@engine/scene/scene";
import {FastMap} from "@engine/misc/collection/fastMap";

export class WebGlRendererHelper extends RendererHelper {

    private frameBuffers:FastMap<Scene,FrameBuffer> = new FastMap();

    public renderSceneToTexture(scene:Scene): ResourceLink<ITexture> {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        let fb:FrameBuffer = this.frameBuffers.get(scene)!;
        if (fb===undefined) {
            fb = new FrameBuffer(renderer.getNativeContext(),this.game.width,this.game.height);
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


}