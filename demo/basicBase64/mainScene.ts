import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/resources/resourceLink";


import logoBase64 = require("../assets/engine.jpg");

export class MainScene extends Scene {

    private logoObj:GameObject;
    private resourceLink:ResourceLink;

    onPreloading() {
        this.resourceLink = this.resourceLoader.loadImage(logoBase64);
    }


    onReady() {
        this.logoObj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
        spr.setResourceLink(this.resourceLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);
    }

}
