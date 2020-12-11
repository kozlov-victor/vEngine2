import {ImageCacheSurface} from "@engine/renderable/impl/surface/imageCacheSurface";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";

export class NoOverflowSurface extends ImageCacheSurface {

    protected autoCalculateScale():void {
        if (this.drawingSurface!==undefined) {
            this.drawingSurface.destroy();
        }
        this.drawingSurface = new DrawingSurface(this.game,this.size);
    }
}
