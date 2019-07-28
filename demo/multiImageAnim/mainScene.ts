import {Scene} from "@engine/core/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";


export class MainScene extends Scene {

    private obj:GameObject;
    private resourceLinks:ResourceLink<Texture>[] = [];

    public onPreloading() {
        for (let i:number = 0;i<6;i++) {
            this.resourceLinks[i] = this.resourceLoader.loadImage(`./multiImageAnim/character/ninja_right_${i+1}.png`);
        }
        console.log('on preloading');
    }

    public onReady() {
        this.obj = new GameObject(this.game);
        const anim:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim.frames = this.resourceLinks;
        anim.isRepeat = true;
        this.obj.sprite = anim.currSprite;
        this.obj.addFrameAnimation('animation',anim);
        this.obj.playFrameAnimation('animation');
        this.obj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.obj);

        let playing:boolean = true;

        this.on(MOUSE_EVENTS.click,()=>{
           playing = !playing;
           if (playing) { this.obj.playFrameAnimation('animation'); }
           else { this.obj.stopFrameAnimation(); }
        });
        // this.obj.sprite.size.width = 100;

        (window as any).obj = this.obj;

    }

}
