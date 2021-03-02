import {Scene} from "@engine/scene/scene";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private resourceLink:ITexture;

    public onPreloading(taskQueue:TaskQueue):void {
        taskQueue.addNextTask(async progress=>{
            this.resourceLink = await taskQueue.getLoader().loadTexture('./frameAnimation3/air.png',progress);
        });
    }


    public onReady():void {

        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.resourceLink);
        animatedImage.setPixelPerfect(true);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
        anim.frames = new Array(5*11-2).fill(0).map((it,i)=>i);
        anim.isRepeating = false;
        anim.duration = 5000;
        anim.setSpriteSheetSize(5,11);
        animatedImage.addFrameAnimation('animation',anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        animatedImage.anchorPoint.setToCenter();
        animatedImage.transformPoint.setToCenter();
        animatedImage.scale.setXY(8);
        this.appendChild(animatedImage);



    }

}
