import {Scene} from "@engine/model/impl/scene";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

// https://www.twobitarcade.net/article/displaying-images-oled-displays/

export class MainScene extends Scene {

    private frames:Image[];
    private resourceLink:ResourceLink<ArrayBuffer>[] = [];

    onPreloading() {
        this.resourceLink.push(this.resourceLoader.loadBinary('./data/scatman.1.pbm'));
    }


    onReady() {
        const renderer:WebGlRenderer = this.game.getRenderer() as WebGlRenderer;
        const gl:WebGLRenderingContext = renderer.getNativeContext();
        const t:Texture = new Texture(gl);

        const link:ResourceLink<Texture> = new ResourceLink<Texture>('url1');
        renderer.putToCache(link,t);
        t.setRawData(new Uint8Array([255, 0, 0, 255]),1,1);
        link.setTarget(t);
        const image:Image = new Image(this.game);
        image.setResourceLink(link);
        this.appendChild(image);
    }

}
