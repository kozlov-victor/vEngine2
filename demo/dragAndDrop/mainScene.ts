import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";


export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');
    }


    public onReady() {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        spr.addBehaviour(new DraggableBehaviour(this.game));

        const spr1:Image = new Image(this.game);
        spr1.setResourceLink(this.logoLink);
        spr1.pos.fromJSON({x:100,y:100});
        spr1.addBehaviour(new DraggableBehaviour(this.game));

        spr.appendChild(spr1);


    }

}
