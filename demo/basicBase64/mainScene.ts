import {GameObject} from "@engine/model/impl/general/gameObject";
import {Scene} from "@engine/model/impl/general/scene";
import {ResourceLink} from "@engine/resources/resourceLink";


import {Image} from "@engine/model/impl/geometry/image";
import {Texture} from "@engine/renderer/webGl/base/texture";
import * as logoBase64 from "../assets/engine.jpg";

export class MainScene extends Scene {

    private logoObj: GameObject;
    private resourceLink: ResourceLink<Texture>;

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
