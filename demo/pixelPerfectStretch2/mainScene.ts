import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    @Resource.Texture('./pixelPerfectStretch2/images/pig.png')
    private img1:ResourceLink<ITexture>;


    @Resource.Texture('./pixelPerfectStretch2/images/cow.png')
    private img2:ResourceLink<ITexture>;

    @Resource.Texture('./pixelPerfectStretch2/images/dog.png')
    private img3:ResourceLink<ITexture>;

    @Resource.Texture('./pixelPerfectStretch2/images/girl.png')
    private img4:ResourceLink<ITexture>;

    @Resource.Texture('./pixelPerfectStretch2/images/eagle.png')
    private img5:ResourceLink<ITexture>;

    private cnt:number = 0;
    private links:ResourceLink<ITexture>[];

    private nextImage():void {
        const sprLogo:Image = new Image(this.game);
        sprLogo.setResourceLink(this.links[(this.cnt++)%this.links.length]);
        sprLogo.setPixelPerfect(true);

        const container:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
        container.appendChild(sprLogo);
        container.scale.setXY(9);

        this.appendChild(container);

        sprLogo.on(MOUSE_EVENTS.click, e=>{
            container.removeSelf();
            this.nextImage();
        });
    }

    public onReady():void {

        this.links = [
            this.img1, this.img2, this.img3, this.img4, this.img5
        ];

        this.nextImage();

    }

}
