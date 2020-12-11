import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";


export class MainScene extends Scene {

    private resourceLinks1:ResourceLink<ITexture>[] = [];
    private resourceLinks2:ResourceLink<ITexture>[] = [];
    private resourceLinks3:ResourceLink<ITexture>[] = [];

    public onPreloading():void {
        for (let i:number = 0;i<5;i++) {
            this.resourceLinks1[i] =
                this.resourceLoader.loadTexture(`./multiImageAnim2/character/Attack1/1_terrorist_1_Attack1_00${i}.png`);
        }
        for (let i:number = 0;i<4;i++) {
            this.resourceLinks2[i] =
                this.resourceLoader.loadTexture(`./multiImageAnim2/character/Attack2/1_terrorist_1_Attack2_00${i}.png`);
        }
        for (let i:number = 0;i<6;i++) {
            this.resourceLinks3[i] =
                this.resourceLoader.loadTexture(`./multiImageAnim2/character/Attack3/1_terrorist_1_Attack3_00${i}.png`);
        }
    }

    public onReady():void {

        const animatedImage:AnimatedImage = new AnimatedImage(this.game);
        let animNum:number = 1;
        animatedImage.pos.setXY(10,10);
        animatedImage.scale.setXY(0.8);

        const anim1:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim1.frames = this.resourceLinks1;
        anim1.isRepeating = true;
        animatedImage.addFrameAnimation('animation1',anim1);

        const anim2:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim2.frames = this.resourceLinks2;
        anim2.isRepeating = true;
        animatedImage.addFrameAnimation('animation2',anim2);


        const anim3:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim3.frames = this.resourceLinks3;
        anim3.isRepeating = true;
        animatedImage.addFrameAnimation('animation3',anim3);

        animatedImage.playFrameAnimation('animation1');
        this.appendChild(animatedImage);


        this.on(MOUSE_EVENTS.click,()=>{
            animNum = animNum+1;
            if (animNum===4) animNum = 1;
            animatedImage.playFrameAnimation(`animation${(animNum)}`);
        });


    }

}
