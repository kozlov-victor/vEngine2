import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private resourceLinks:ITexture[] = [];

    public onPreloading(taskQueue:TaskQueue):void {
        for (let i: number = 0; i < 6; i++) {
            taskQueue.addNextTask(async progress => {
                this.resourceLinks[i] = await taskQueue.getLoader().loadTexture(`./multiImageAnim/character/ninja_right_${i + 1}.png`, progress);
            });
        }
    }


    public onReady():void {
        const anim:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim.frames = this.resourceLinks;
        anim.isRepeating = true;
        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.resourceLinks[0]);
        animatedImage.addFrameAnimation('animation',anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.fromJSON({x:10,y:10});
        this.appendChild(animatedImage);

        let playing:boolean = true;

        this.mouseEventHandler.on(MOUSE_EVENTS.click,_=>{
           playing = !playing;
           if (playing) { animatedImage.playFrameAnimation('animation'); }
           else { animatedImage.stopFrameAnimation(); }
        });

    }

}
