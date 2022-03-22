import {Scene} from "@engine/scene/scene";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private resourceLink:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        taskQueue.addNextTask(async progress=>{
            this.resourceLink = await taskQueue.getLoader().loadTexture('./frameAnimation3/air.png',progress);
        });
    }


    public override onReady():void {

        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.resourceLink);
        animatedImage.setPixelPerfect(true);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game,{
            name: 'animation',
            frames: {to:5*11-2},
            duration: 5000,
            isRepeating: false,
            numOfFramesHorizontally: 5,
            numOfFramesVertically: 11,
        });
        animatedImage.addFrameAnimation(anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        animatedImage.anchorPoint.setToCenter();
        animatedImage.transformPoint.setToCenter();
        animatedImage.scale.setXY(8);
        this.appendChild(animatedImage);



    }

}
