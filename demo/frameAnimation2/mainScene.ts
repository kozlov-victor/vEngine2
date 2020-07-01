import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture('./frameAnimation2/can.png')
    private resourceLink:ResourceLink<ITexture>;


    public onReady() {

        const animatedImage:AnimatedImage = new AnimatedImage(this.game);
        animatedImage.setResourceLink(this.resourceLink);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
        anim.frames = new Array(28).fill(0).map((it,index)=>index);
        anim.isRepeating = true;
        anim.setSpriteSheetSize(28,1);
        animatedImage.addFrameAnimation('animation',anim);
        animatedImage.playFrameAnimation('animation');
        animatedImage.pos.setXY(10,10);
        this.appendChild(animatedImage);

        let playing:boolean = true;

        this.on(MOUSE_EVENTS.click,()=>{
           playing = !playing;
           if (playing) { animatedImage.playFrameAnimation('animation'); }
           else { animatedImage.stopFrameAnimation(); }
        });

        animatedImage.scale.setXY(3);
        animatedImage.setPixelPerfect(true);


    }

}
