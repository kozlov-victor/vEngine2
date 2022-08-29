import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    @Resource.Texture('./pixelPerfectStretch2/images/pig.png')
    public readonly img1:ITexture;


    @Resource.Texture('./pixelPerfectStretch2/images/cow.png')
    public readonly img2:ITexture;

    @Resource.Texture('./pixelPerfectStretch2/images/dog.png')
    public readonly img3:ITexture;

    @Resource.Texture('./pixelPerfectStretch2/images/girl.png')
    public readonly img4:ITexture;

    @Resource.Texture('./pixelPerfectStretch2/images/eagle.png')
    public readonly img5:ITexture;

    private cnt:number = 0;
    private links:ITexture[];

    private nextImage():void {
        const sprLogo:Image = new Image(this.game,this.links[(this.cnt++)%this.links.length]);
        sprLogo.setPixelPerfect(true);

        const container:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
        container.appendChild(sprLogo);
        container.scale.setXY(9);

        this.appendChild(container);

        sprLogo.mouseEventHandler.on(MOUSE_EVENTS.click, e=>{
            container.removeSelf();
            this.nextImage();
        });
    }

    public override onReady():void {

        this.links = [
            this.img1, this.img2, this.img3, this.img4, this.img5
        ];

        this.nextImage();

    }

}
