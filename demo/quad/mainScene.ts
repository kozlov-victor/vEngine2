import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextureQuad} from "@engine/renderable/impl/geometry/textureQuad";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;

    public onReady():void {
        const quad = new TextureQuad(this.game,this.logoTexture);
        quad.pos.setXY(10,10);
        this.appendChild(quad);
    }

}
