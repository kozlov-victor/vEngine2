import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {OtaReader} from "./otaReader";
import {ScaleHelper} from "@engine/renderer/abstract/scaleStrategy/impl/ScaleStrategyFitCanvasToScreen";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import * as files from "ls/ls-loader!./ota";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";

export class MainScene extends Scene {

    // https://www.mobilesmspk.net/picture-messages/all/3

    public override onReady():void {
        console.log(files);

        let image:Image;
        let i = 0;
        let pending = false;

        const container = new SimpleGameObjectContainer(this.game);
        container.size.setWH(320,200);
        container.anchorPoint.setToCenter();
        container.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        container.appendTo(this);

        const loadNextImage = async ()=>{
            if (pending) return;
            pending = true;
            if (image) {
                image.removeSelf();
                image.destroy();
            }
            const src = files[i];
            const buff = await new ResourceLoader(this.game).loadBinary(`./ota/${src}`);

            const reader = new OtaReader(this.game,buff);
            image = reader.asImage();
            const metrics = ScaleHelper.calcMetrixToFitRectToWindow(image.size,container.size);
            image.scale.setFrom(metrics.scale);
            image.pos.setFrom(metrics.pos);
            image.setPixelPerfect(true);
            image.appendTo(container);
            i = (++i) % files.length;
            pending = false;
        }

        this.mouseEventHandler.on(MOUSE_EVENTS.click, async e=>{
            await loadNextImage();
        });

        loadNextImage().then();

    }
}
