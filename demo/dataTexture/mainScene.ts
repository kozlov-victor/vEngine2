import {Scene} from "@engine/scene/scene";
import {PbmReader} from "./pbmReader";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {ITexture} from "@engine/renderer/common/texture";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {TaskQueue} from "@engine/resources/taskQueue";

// https://www.twobitarcade.net/article/displaying-images-oled-displays/

export class MainScene extends Scene {

    private textures:ITexture[] = [];


    public onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        const resources: ArrayBuffer[] = [];
        for (let i: number = 1; i <= 6; i++) {
            taskQueue.addNextTask(async progress => {
                resources[i - 1] = await taskQueue.getLoader().loadBinary(`./dataTexture/data/scatman.${i}.pbm`, progress);
            });
        }
        taskQueue.getLoader().addNextTask(async _ => {
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
