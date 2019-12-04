import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";


import {Image} from "@engine/renderable/impl/general/image";
import * as logoBase64 from "../assets/engine.jpg";
import {ITexture} from "@engine/renderer/common/texture";

export class MainScene extends Scene {

    private resourceLink: ResourceLink<ITexture>;

    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadImage(logoBase64);
    }


    public async onReady() {
        const spr: Image = new Image(this.game);
        spr.setResourceLink(this.resourceLink);
        spr.pos.fromJSON({x: 10, y: 10});
        this.appendChild(spr);
    }

}
