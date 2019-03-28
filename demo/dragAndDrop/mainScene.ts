import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');
    }


    onReady() {
        this.logoObj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        this.logoObj.addBehaviour(new DraggableBehaviour(this.game));

        let objChild:GameObject = new GameObject(this.game);
        let spr1:SpriteSheet = new SpriteSheet(this.game);
        spr1.setResourceLink(this.logoLink);
        objChild.sprite = spr1;
        objChild.pos.fromJSON({x:100,y:100});
        objChild.addBehaviour(new DraggableBehaviour(this.game));

        this.logoObj.appendChild(objChild);

        (window as any).l = this.logoObj;


    }

}
