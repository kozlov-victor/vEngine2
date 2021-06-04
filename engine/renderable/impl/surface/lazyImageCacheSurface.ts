import {ImageCacheSurface} from "@engine/renderable/impl/surface/imageCacheSurface";


export class LazyImageCacheSurface extends ImageCacheSurface {

    private redrawRequested:boolean = false;

    public requestRedraw():void {
        this.redrawRequested = true;
    }

    protected override _drawToSurface():void {
        if (!this.redrawRequested) return;
        super._drawToSurface();
    }

    public override render():void {
        super.render();
        this.redrawRequested = false;
    }

}
