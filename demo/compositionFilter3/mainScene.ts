import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;

    public override onReady():void {

        const container = new SimpleGameObjectContainer(this.game);
        container.forceDrawChildrenOnNewSurface = true;
        this.appendChild(container);

        const curve1 = Polygon.fromSvgPath(
            this.game,
            `M95,60c-2,3-6,7-11,7c-6,0-12-3-12-10c0-10,15-14,27-14v3c0,6-1,10-4,14`
        );

        const curve2 = Polygon.fromSvgPath(
            this.game,
            `M121,68v-41c0-9-2-15-7-20c-5-4-13-7-24-7c-11,0-20,3-28,7c6,5,10,12,12,21c0-8,5-11,13-11c9,0,11,7,11,14h1c-25,1-49,6-48,28c0,16,15,23,25,23c1,0,17,1,24-11c0,3,0,7,1,9h22c-2-4-2-8-2-12
`
        );
        curve2.filters = [new EvenOddCompositionFilter(this.game)];

        container.appendChild(curve1);
        container.appendChild(curve2);




    }

}
