import {Scene} from "@engine/scene/scene";
import {XbmReader} from "./xbmReader";
import {ScaleHelper} from "@engine/renderer/abstract/scaleStrategy/impl/ScaleStrategyFitCanvasToScreen";
import {Image} from "@engine/renderable/impl/general/image/image";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ResourceLoader} from "@engine/resources/resourceLoader";

export class MainScene extends Scene {

    private sources = [
        './xbm/data/x/x1.xbm',
        './xbm/data/x/x2.xbm',
        './xbm/data/x/x3.xbm',
        './xbm/data/x/x4.xbm',
        './xbm/data/x/x5.xbm',
        './xbm/data/x/x6.xbm',
        './xbm/data/x/x7.xbm',
        './xbm/data/x/x8.xbm',
        './xbm/data/x/x9.xbm',
        './xbm/data/test.xbm',
        './xbm/data/swirl2.xbm',
        './xbm/data/dolphin.xbm',
        './xbm/data/serj.xbm',
        './xbm/data/sample.xbm',
        './xbm/data/letter_a.xbm',
        './xbm/data/pumpkin.xbm',
        './xbm/data/circles.xbm',
        './xbm/data/fracture.xbm',
        './xbm/data/cross.xbm',
        './xbm/data/code.xbm',
        './xbm/data/handok.xbm',
        './xbm/data/iot.xbm',
        './xbm/data/ironman.xbm',
        './xbm/data/java.xbm',
        './xbm/data/metallica.xbm',
        './xbm/data/pikachu.xbm',
        './xbm/data/pooh.xbm',
        './xbm/data/punisher.xbm',
        './xbm/data/raspberrypi.xbm',
        './xbm/data/sepultura.xbm',
        './xbm/data/slayer.xbm',
        './xbm/data/soulfly.xbm',
        './xbm/data/startwars.xbm',
    ]

    public override onReady():void {

        let image:Image;
        let i = 0;
        let pending = false;

        this.mouseEventHandler.on(MOUSE_EVENTS.click, async e=>{
            if (pending) return;
            pending = true;
            if (image) {
                image.removeSelf();
                image.destroy();
            }
            const src = await new ResourceLoader(this.game).loadText(this.sources[i]);
            const reader = new XbmReader(this.game,src);
            image = reader.asImage();
            const metrics = ScaleHelper.calcMetrixToFitRectToWindow(image.size,this.game.size);
            image.scale.setFrom(metrics.scale);
            image.pos.setFrom(metrics.pos);
            image.setPixelPerfect(true);
            image.appendTo(this);
            i = (++i) % this.sources.length;
            pending = false;
        });
    }
}
