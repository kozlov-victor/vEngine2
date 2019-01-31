import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {FrameAnimation} from "@engine/model/impl/frameAnimation";


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
        this.obj.frameAnimations.push(anim);
        this.obj.playFrameAnimation(anim);
        anim.play();
        spr.setResourceLink(this.resourceLink);
        this.obj.spriteSheet = spr;
        this.obj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.obj);
    }

}
