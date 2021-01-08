import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoLink:ResourceLink<ITexture>;


    public onReady():void {

        this.camera.scale.setXY(1.6);
        this.camera.pos.setXY(-10,-15);

        const spr:Image = new Image(this.game);
        spr.scale.setXY(0.2);
        spr.setResourceLink(this.logoLink);
        spr.pos.setXY(50,50);
        this.appendChild(spr);

        spr.addBehaviour(new DraggableBehaviour(this.game));

        const spr1:Image = new Image(this.game);
        spr1.setResourceLink(this.logoLink);
        spr1.pos.fromJSON({x:100,y:100});
        spr1.scale.setXY(1.2);
        spr1.addBehaviour(new DraggableBehaviour(this.game));

        spr.appendChild(spr1);

    }

}
