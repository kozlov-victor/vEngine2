import {Scene} from "@engine/scene/scene";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Image} from "@engine/renderable/impl/general/image/image";
import {BoxBlurKernelFilter} from "@engine/renderer/webGl/filters/kernel/boxBlurKernelFilter";
import {EdgeDetectionKernelFilter} from "@engine/renderer/webGl/filters/kernel/edgeDetectionKernelFilter";
import {EmbossKernelFilter} from "@engine/renderer/webGl/filters/kernel/embossKernelFilter";
import {SharpenKernelFilter} from "@engine/renderer/webGl/filters/kernel/sharpenKernelFilter";
import {DebugLayer} from "@engine/scene/debugLayer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";
import {HexagonalFilter} from "@engine/renderer/webGl/filters/texture/hexagonalFilter";
import {LowResolutionFilter} from "@engine/renderer/webGl/filters/texture/lowResolutionFilter";
import {MotionBlurFilter} from "@engine/renderer/webGl/filters/texture/motionBlurFilter";
import {PosterizeFilter} from "@engine/renderer/webGl/filters/texture/posterizeFilter";
import {InvertBgColorCompositionFilter} from "@engine/renderer/webGl/filters/composition/invertBgColorCompositionFilter";
import {InvertColorFilter} from "@engine/renderer/webGl/filters/texture/invertColorFilter";

export class MainScene extends Scene {

    public override async onReady():Promise<void> {
        const video = document.createElement('video');
        video.width = this.game.width;
        video.height = this.game.height;
        video.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        await video.play();

        const texture:Texture = new Texture(this.getGame().getRenderer<WebGlRenderer>().getNativeContext());
        texture.setImage(video);
        this.setInterval(()=>{
            texture.setImage(video);
        },1);

        const image = new Image(this.game,texture);
        image.transformPoint.setToCenter();
        image.scale.x = -1;
        this.appendChild(image);


        const filters = [
            new BoxBlurKernelFilter(this.game),
            new EdgeDetectionKernelFilter(this.game),
            new EmbossKernelFilter(this.game),
            new SharpenKernelFilter(this.game),
            (()=>{
                const f = new BlackWhiteFilter(this.game);
                f.setMixFactor(0.2);
                return f;
            })(),
            new HexagonalFilter(this.game),
            new LowResolutionFilter(this.game),
            new MotionBlurFilter(this.game),
            new PosterizeFilter(this.game),
            new InvertColorFilter(this.game)
        ];
        let cnt = -1;
        const debugLayer = new DebugLayer(this.game);
        debugLayer.filters = [new InvertBgColorCompositionFilter(this.game)];
        this.appendChild(debugLayer);
        debugLayer.println('press Right key to set filter');
        this.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT,e=>{
            cnt++;
            cnt=cnt%filters.length;
            debugLayer.log(filters[cnt]);
            this.getLayerAtIndex(0).filters = [filters[cnt]];
        });

    }
}
