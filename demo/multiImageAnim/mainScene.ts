import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";


export class MainScene extends Scene {

    private resourceLinks:ResourceLink<ITexture>[] = [];

    public onPreloading() {
        for (let i:number = 0;i<6;i++) {
            this.resourceLinks[i] = this.resourceLoader.loadTexture(`./multiImageAnim/character/ninja_right_${i+1}.png`);
        }
        console.log('on preloading');
    }

    public onReady() {
        const anim:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim.frames = this.resourceLinks;
        anim.isRepeating = true;
        const animatedImage:AnimatedImage = new AnimatedImage(this.game);
        animatedImage.addFrameAnimation('animation',anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.fromJSON({x:10,y:10});
        this.appendChild(animatedImage);

        let playing:boolean = true;

        this.on(MOUSE_EVENTS.click,()=>{
           playing = !playing;
           if (playing) { animatedImage.playFrameAnimation('animation'); }
           else { animatedImage.stopFrameAnimation(); }
        });

    }

}
