import {Scene} from "@engine/scene/scene";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture('./frameAnimation2/imgs/can.png')
    public readonly resourceLink1:ITexture;

    @Resource.Texture('./frameAnimation2/imgs/settings.png')
    public readonly resourceLink2:ITexture;

    private cnt:number = 0;
    private links:ITexture[] = [];


    private createNextAnimation():void {
        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.links[this.cnt]);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game,{
            frames: new Array(28).fill(0).map((it,index)=>index),
            name: 'animation',
            isRepeating: true,
            duration: 1300,
            numOfFramesHorizontally: 28,
            numOfFramesVertically: 1,
        });
        animatedImage.addFrameAnimation(anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.setXY(10,10);

        animatedImage.scale.setXY(3);
        animatedImage.setPixelPerfect(true);

        this.appendChild(animatedImage);

        animatedImage.mouseEventHandler.on(MOUSE_EVENTS.click,()=>{
            animatedImage.removeSelf();
            this.cnt++;
            if (this.cnt===this.links.length) this.cnt = 0;
            this.createNextAnimation();
        });

    }

    public override onReady():void {
        this.links = [
            this.resourceLink1,
            this.resourceLink2
        ];
        this.createNextAnimation();
    }

}
