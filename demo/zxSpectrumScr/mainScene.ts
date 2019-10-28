import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/geometry/image";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {ScrReader} from "./scrReader";

export class MainScene extends Scene {

    private img:Image;


    public onPreloading() {
        (this.game.getRenderer() as WebGlRenderer).setPixelPerfectMode(true);
        const img = new Image(this.game);
        this.img = img;
        const binary = this.resourceLoader.loadBinary('./zxSpectrumScr/files/test.scr');
        this.resourceLoader.addNextTask(()=>{
            const reader = new ScrReader(this.game,binary.getTarget());
            const link = reader.createTextureLink();
            img.setResourceLink(link);
        });

    }

    public onReady() {
        this.appendChild(this.img);
    }

}
