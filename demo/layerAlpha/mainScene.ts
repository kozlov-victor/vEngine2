import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Layer} from "@engine/scene/layer";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;

    private createLayer(y:number):Layer {
        const layer = new Layer(this.game);
        const spr: Image = new Image(this.game, this.logoTexture);
        spr.pos.setXY(100,y);
        spr.transformPoint.setToCenter();
        spr.addBehaviour(new DraggableBehaviour(this.game));
        layer.appendChild(spr);
        const cloned = spr.clone();
        cloned.pos.y+=40;
        layer.appendChild(cloned);

        this.appendChild(layer);
        return layer;
    }

    public override onReady():void {
        const l1 = this.createLayer(100);
        l1.alpha = 0.8;

        const l2 = this.createLayer(200);
        l2.alpha = 0.6;

        const l3 = this.createLayer(300);
        l3.alpha = 0.3;
    }
}
