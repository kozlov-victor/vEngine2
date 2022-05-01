import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

export class MainScene extends Scene {

    public override onReady():void {

    }

    protected override onRender() {
        super.onRender();
        const glRenderer = this.game.getRenderer<WebGlRenderer>();
        glRenderer.drawExperimentalBatch();
    }

}
