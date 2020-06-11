import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";


import {Image} from "@engine/renderable/impl/general/image";
import * as logoBase64 from "../assets/engine.jpg";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture(logoBase64)
    private resourceLink: ResourceLink<ITexture>;

    public onReady() {
        const spr: Image = new Image(this.game);
        spr.setResourceLink(this.resourceLink);
        spr.pos.fromJSON({x: 10, y: 10});
        this.appendChild(spr);
    }

}
