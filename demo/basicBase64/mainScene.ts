import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import * as logoBase64 from "../assets/engine.jpg";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture(logoBase64)
    private resourceTexture: ITexture;

    public override onReady():void {
        const spr: Image = new Image(this.game,this.resourceTexture);
        spr.pos.fromJSON({x: 10, y: 10});
        this.appendChild(spr);
    }

}
