import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";

export class DrawingScene extends Scene {

    private readonly canvas:DrawingSurface;

    constructor(game:Game) {
        super(game);
        this.canvas = new DrawingSurface(this.game,this.game.size);
        this.canvas.setPixelPerfect(true);
        (this.game.getRenderer() as WebGlRenderer).setPixelPerfect(true);
        this.appendChild(this.canvas);
    }

    override onReady() {
        super.onReady();
        this.canvas.clear();
        this.canvas.setFillColor(Color.NONE);
    }

    public getCanvas():DrawingSurface {
        return this.canvas;
    }

}
