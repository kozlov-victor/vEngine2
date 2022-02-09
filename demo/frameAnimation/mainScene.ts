import {Scene} from "@engine/scene/scene";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private resourceLink:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        taskQueue.addNextTask(async progress=>{
            this.resourceLink = await taskQueue.getLoader().loadTexture('./assets/character.png');
        });
        console.log('on preloading');
    }

    public override onReady():void {
        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.resourceLink);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game,{
            name: 'animation',
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
            isRepeating: true,
            numOfFramesHorizontally: 5,
            numOfFramesVertically: 3,
        });
        animatedImage.addFrameAnimation(anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.fromJSON({x:10,y:10});
        this.appendChild(animatedImage);

        let playing:boolean = true;

        this.mouseEventHandler.on(MOUSE_EVENTS.click,_=>{
           playing = !playing;
           if (playing) { animatedImage.playFrameAnimation('animation'); }
           else { animatedImage.stopFrameAnimation(); }
        });
        // this.obj.sprite.size.width = 100;


    }

}
