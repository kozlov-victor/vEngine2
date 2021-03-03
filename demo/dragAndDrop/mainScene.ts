import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;


    public onReady():void {

        this.camera.scale.setXY(1.6);
        this.camera.pos.setXY(-10,-15);

        const spr:Image = new Image(this.game,this.logoTexture);
        spr.scale.setXY(0.2);
        spr.pos.setXY(50,50);
        this.appendChild(spr);

        spr.addBehaviour(new DraggableBehaviour(this.game));

        const spr1:Image = new Image(this.game,this.logoTexture);
        spr1.pos.fromJSON({x:100,y:100});
        spr1.scale.setXY(1.2);
        spr1.addBehaviour(new DraggableBehaviour(this.game));

        spr.appendChild(spr1);

    }

}
