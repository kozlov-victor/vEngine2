import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    public readonly logoTexture:ITexture;

    public override onReady():void {

        const container = new SimpleGameObjectContainer(this.game);
        container.forceDrawChildrenOnNewSurface = true;
        this.appendChild(container);

        const spr = new Image(this.game,this.logoTexture);
        spr.pos.setFrom({x:10,y:10});
        spr.transformPoint.setToCenter();
        spr.addBehaviour(new DraggableBehaviour(this.game));
        container.appendChild(spr);

        const spr2 = new Circle(this.game);
        spr2.pos.setXY(50,150);
        spr2.addBehaviour(new DraggableBehaviour(this.game));
        spr2.filters = [new EvenOddCompositionFilter(this.game)];
        spr.appendChild(spr2);

    }

}
