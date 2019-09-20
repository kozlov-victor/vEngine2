import {Scene} from "@engine/scene/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ITexture} from "@engine/renderer/texture";


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');
    }


    public onReady() {
        this.logoObj = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        this.logoObj.addBehaviour(new DraggableBehaviour(this.game));

        const objChild:GameObject = new GameObject(this.game);
        const spr1:Image = new Image(this.game);
        spr1.setResourceLink(this.logoLink);
        objChild.sprite = spr1;
        objChild.pos.fromJSON({x:100,y:100});
        objChild.addBehaviour(new DraggableBehaviour(this.game));

        this.logoObj.appendChild(objChild);


    }

}
