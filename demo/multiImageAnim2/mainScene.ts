import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private resourceLinks1:ITexture[] = [];
    private resourceLinks2:ITexture[] = [];
    private resourceLinks3:ITexture[] = [];

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        for (let i:number = 0;i<5;i++) {
            taskQueue.addNextTask(async progress=>{
                this.resourceLinks1[i] =
                    await taskQueue.getLoader().loadTexture(`./multiImageAnim2/character/Attack1/1_terrorist_1_Attack1_00${i}.png`,progress);
            });
        }
        for (let i:number = 0;i<4;i++) {
            taskQueue.addNextTask(async progress=>{
                this.resourceLinks2[i] =
                    await taskQueue.getLoader().loadTexture(`./multiImageAnim2/character/Attack2/1_terrorist_1_Attack2_00${i}.png`,progress);
            });
        }
        for (let i:number = 0;i<6;i++) {
            taskQueue.addNextTask(async progress=>{
                this.resourceLinks3[i] =
                    await taskQueue.getLoader().loadTexture(`./multiImageAnim2/character/Attack3/1_terrorist_1_Attack3_00${i}.png`,progress);
            });
        }
    }

    public override onReady():void {

        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.resourceLinks1[0]);
        let animNum:number = 1;
        animatedImage.pos.setXY(10,10);
        animatedImage.scale.setXY(0.8);

        const anim1:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game,{
            frames: this.resourceLinks1,
            isRepeating: true,
            duration: 1000,
        });
        animatedImage.addFrameAnimation(anim1);

        const anim2:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game,{
            frames: this.resourceLinks2,
            isRepeating: true,
            duration: 1000,
        });
        animatedImage.addFrameAnimation(anim2);

        const anim3:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game,{
            frames: this.resourceLinks3,
            isRepeating: true,
            duration: 1000,
        });
        animatedImage.addFrameAnimation(anim3);

        anim1.play();
        this.appendChild(animatedImage);

        const all = [anim1, anim2, anim3];


        this.mouseEventHandler.on(MOUSE_EVENTS.click,()=>{
            animNum = animNum+1;
            if (animNum===4) animNum = 1;
           all[animNum].play();
        });


    }

}
