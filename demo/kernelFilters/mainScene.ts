import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {BoxBlurKernelFilter} from "@engine/renderer/webGl/filters/kernel/boxBlurKernelFilter";
import {EdgeDetectionKernelFilter} from "@engine/renderer/webGl/filters/kernel/edgeDetectionKernelFilter";
import {EmbossKernelFilter} from "@engine/renderer/webGl/filters/kernel/embossKernelFilter";
import {SharpenKernelFilter} from "@engine/renderer/webGl/filters/kernel/sharpenKernelFilter";
import {DebugLayer} from "@engine/scene/debugLayer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;

    public override onReady():void {
        const spr: Image = new Image(this.game, this.logoTexture);
        spr.pos.fromJSON({x: 10, y: 10});
        spr.transformPoint.setToCenter();
        spr.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(spr);

        const filters = [
            new BoxBlurKernelFilter(this.game),
            new EdgeDetectionKernelFilter(this.game),
            new EmbossKernelFilter(this.game),
            new SharpenKernelFilter(this.game),
        ];
        let cnt = -1;
        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);
        debugLayer.println('press Right key to set filter')
        this.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT,e=>{
            cnt++;
            cnt=cnt%filters.length;
            debugLayer.println(filters[cnt]);
            this.getLayerAtIndex(0).filters = [filters[cnt]];
        });

    }
}
