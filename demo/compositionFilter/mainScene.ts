import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoTexture);
        spr.pos.fromJSON({x:10,y:10});
        spr.transformPoint.setToCenter();
        spr.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(spr);

        const spr2 = spr.clone();
        spr2.pos.setXY(50,50);
        spr2.filters = [new EvenOddCompositionFilter(this.game)];
        spr.appendChild(spr2);

    }

}
