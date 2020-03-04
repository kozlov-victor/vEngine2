import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Source} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Source.Texture('./assets/logo.png')
    private logoLink:ResourceLink<ITexture>;


    public onReady() {

        //this.game.camera.scale.setXY(1.5);

        const spr:Image = new Image(this.game);
        spr.scale.setXY(0.3);
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
