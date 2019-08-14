import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {Scene} from "@engine/core/scene";
import {ResourceLink} from "@engine/resources/resourceLink";


import {Image} from "@engine/renderable/impl/geometry/image";
import * as logoBase64 from "../assets/engine.jpg";
import {ITexture} from "@engine/renderer/texture";

export class MainScene extends Scene {

    private logoObj: GameObject;
    private resourceLink: ResourceLink<ITexture>;

    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadImage(logoBase64);
    }


    public async onReady() {
        this.logoObj = new GameObject(this.game);
        const spr: Image = new Image(this.game);
        spr.setResourceLink(this.resourceLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x: 10, y: 10});
        this.appendChild(this.logoObj);
    }

}
