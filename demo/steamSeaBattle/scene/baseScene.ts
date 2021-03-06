import {AbstractAppScene} from "./abstract/abstractAppScene";
import {PixelFilter} from "@engine/renderer/webGl/filters/texture/pixelFilter";
import {Timer} from "@engine/misc/timer";

export abstract class BaseScene extends AbstractAppScene{

    public override onReady(): void {
        super.onReady();
        const pixelFilter:PixelFilter = new PixelFilter(this.game);
        let a = 10;
        this.filters = [pixelFilter];
        const ref:Timer = this.setInterval(()=>{
            a-=1;
            pixelFilter.setPixelSize(a);
            if (a<=1) {
                pixelFilter.setPixelSize(1);
                ref.kill();
            }
        },100);
    }

}
