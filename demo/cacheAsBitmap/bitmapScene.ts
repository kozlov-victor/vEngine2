import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {DebugLayer} from "@engine/scene/debugLayer";

export class BitmapScene extends Scene {

    constructor(game: Game, private cachedBitmap:RenderableModel) {
        super(game);
    }

    override onReady() {
        super.onReady();
        this.cachedBitmap.scale.setXY(2);
        this.cachedBitmap.transformPoint.setToCenter();
        this.appendChild(this.cachedBitmap);
        this.setInterval(()=>{
            this.cachedBitmap.angle+=0.01;
        },10);

        const debugLayer = new DebugLayer(this.game);
        debugLayer.appendTo(this);
        debugLayer.println("cached as bitmap");

    }

}
