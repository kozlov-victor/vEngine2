import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {AnimatedImage} from "@engine/renderable/impl/geometry/animatedImage";


export class MainScene extends Scene {

    private resourceLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadTexture('./assets/character.png');
        console.log('on preloading');
    }


    public onReady() {

        const animatedImage:AnimatedImage = new AnimatedImage(this.game);
        animatedImage.setResourceLink(this.resourceLink);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
        anim.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
        anim.isRepeat = true;
        anim.setSpriteSheetSize(5,3);
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
        // this.obj.sprite.size.width = 100;


    }

}
