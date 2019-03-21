import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {FrameAnimation} from "@engine/model/impl/frameAnimation";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";


export class MainScene extends Scene {

    private obj:GameObject;
    private resourceLink:ResourceLink;

    onPreloading() {
        this.resourceLink = this.resourceLoader.loadImage('../assets/character.png');
        console.log('on preloading');
    }


    onReady() {
        this.obj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
        spr.numOfFramesV = 3;
        spr.numOfFramesH = 5;
        let anim:FrameAnimation = new FrameAnimation(this.game);
        anim.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
        spr.addFrameAnimation('animation',anim);
        anim.isRepeat = true;
        anim.setSpriteSheet(spr);
        spr.playFrameAnimation('animation');
        spr.setResourceLink(this.resourceLink);
        this.obj.sprite = spr;
        this.obj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.obj);

        let playing:boolean = true;

        this.on(MOUSE_EVENTS.click,()=>{
           playing = !playing;
           if (playing) (this.obj.sprite as SpriteSheet).playFrameAnimation('animation');
           else (this.obj.sprite as SpriteSheet).stopFrameAnimation();
        });

        (window as any).obj = this.obj;

    }

}
