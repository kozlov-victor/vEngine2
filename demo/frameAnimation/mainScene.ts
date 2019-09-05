import {Scene} from "@engine/core/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ITexture} from "@engine/renderer/texture";


export class MainScene extends Scene {

    private obj:GameObject;
    private resourceLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadImage('./assets/character.png');
        console.log('on preloading');
    }


    public onReady() {
        this.obj = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.resourceLink);
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
        anim.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
        anim.isRepeat = true;
        anim.setSpriteSheet(spr,5,3);
        this.obj.sprite = spr;
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


    }

}
