import {Scene} from "@engine/scene/scene";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {PbmReader} from "./pbmReader";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {MultiImageFrameAnimation} from "@engine/animation/frameAnimation/multiImageFrameAnimation";

// https://www.twobitarcade.net/article/displaying-images-oled-displays/

export class MainScene extends Scene {

    private resourceLinks:ResourceLink<ArrayBuffer>[] = [];
    private textureLinks:ResourceLink<Texture>[] = [];

    private obj:GameObject;

    public onPreloading() {

        for (let i:number=1;i<=6;i++) {
            this.resourceLinks.push(this.resourceLoader.loadBinary(`./dataTexture/data/scatman.${i}.pbm`));
        }

    }

    public onReady() {


        for (const rl of this.resourceLinks) {
            const pbmReader:PbmReader = new PbmReader(this.game,rl.getTarget());
            this.textureLinks.push(pbmReader.createTextureLink());
        }

        this.obj = new GameObject(this.game);
        const anim:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        anim.frames = this.textureLinks;
        anim.isRepeat = true;
        anim.duration = 600;
        this.obj.sprite = anim.currSprite;
        this.obj.addFrameAnimation('animation',anim);
        this.obj.playFrameAnimation('animation');
        this.appendChild(this.obj);
    }

}
