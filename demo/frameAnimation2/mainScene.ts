import {Scene} from "@engine/scene/scene";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture('./frameAnimation2/imgs/can.png')
    private resourceLink1:ITexture;

    @Resource.Texture('./frameAnimation2/imgs/settings.png')
    private resourceLink2:ITexture;

    private cnt:number = 0;
    private links:ITexture[] = [];


    private createNextAnimation():void {
        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.links[this.cnt]);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
        anim.frames = new Array(28).fill(0).map((it,index)=>index);
        anim.isRepeating = true;
        anim.duration = 1300;
        anim.setSpriteSheetSize(28,1);
        animatedImage.addFrameAnimation('animation',anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.setXY(10,10);

        animatedImage.scale.setXY(3);
        animatedImage.setPixelPerfect(true);

        this.appendChild(animatedImage);

        animatedImage.on(MOUSE_EVENTS.click,()=>{
            animatedImage.removeSelf();
            this.cnt++;
            if (this.cnt===this.links.length) this.cnt = 0;
            this.createNextAnimation();
        });

    }

    public onReady():void {
        this.links = [
            this.resourceLink1,
            this.resourceLink2
        ];
        this.createNextAnimation();
    }

}
