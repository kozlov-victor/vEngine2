import {Scene} from "@engine/scene/scene";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {PbmReader} from "./pbmReader";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {ITexture} from "@engine/renderer/common/texture";
import {ResourceLoader} from "@engine/resources/resourceLoader";

// https://www.twobitarcade.net/article/displaying-images-oled-displays/

export class MainScene extends Scene {

    private textures:ITexture[] = [];


    public onPreloading(resourceLoader:ResourceLoader):void {
        super.onPreloading(resourceLoader);
        const resources: ArrayBuffer[] = [];
        for (let i: number = 1; i <= 6; i++) {
            resourceLoader.addNextTask(async progress => {
                resources[i - 1] = await resourceLoader.loadBinary(`./dataTexture/data/scatman.${i}.pbm`, progress);
            });
        }
        resourceLoader.addNextTask(async _ => {
            for (let i: number = 0; i < resources.length; i++) {
                const pbmReader: PbmReader = new PbmReader(this.game, resources[i]);
                this.textures.push(pbmReader.createTexture());
            }
        });
    }


    public onReady():void {

        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.textures[0]);
        const anim:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim.frames = this.textures;
        anim.isRepeating = true;
        anim.duration = 600;
        animatedImage.addFrameAnimation('animation',anim);
        animatedImage.playFrameAnimation('animation');
        this.appendChild(animatedImage);
    }

}
