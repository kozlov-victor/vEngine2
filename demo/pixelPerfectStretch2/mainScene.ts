import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";

export class MainScene extends Scene {

    @Resource.Texture('./pixelPerfectStretch2/pig.png')
    private img:ResourceLink<ITexture>;



    public onReady() {

        const sprLogo:Image = new Image(this.game);
        sprLogo.setResourceLink(this.img);
        sprLogo.setPixelPerfect(true);
        this.appendChild(sprLogo);

        const container:NullGameObject = new NullGameObject(this.game);
        container.appendChild(sprLogo);
        container.scale.setXY(10);

        this.appendChild(container);

    }

}
