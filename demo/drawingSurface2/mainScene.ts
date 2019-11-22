import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";

export class MainScene extends Scene {

    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(surface);
        surface.setDrawColor(120,222,200);
        surface.setLineWidth(2);
        surface.on(MOUSE_EVENTS.mouseMove, e=>{
            if (e.isMouseDown) surface.lineTo(e.screenX,e.screenY);
            surface.moveTo(e.screenX,e.screenY);
        });
        surface.on(MOUSE_EVENTS.mouseDown, e=>{
            surface.moveTo(e.screenX,e.screenY);
            surface.lineTo(e.screenX,e.screenY);
        });
        const wf = new WaveFilter(this.game);
        wf.setAmplitude(0.01);
        this.filters = [wf];
    }

}
