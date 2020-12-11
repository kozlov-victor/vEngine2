import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    public onPreloading():void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(surface);
        surface.setDrawColor(120,222,200);
        surface.setLineWidth(2);
        surface.on(MOUSE_EVENTS.mouseMove, e=>{
            if (e.isMouseDown) surface.lineTo(e.screenX,e.screenY);
            surface.moveTo(e.screenX,e.screenY);
        });
        surface.on(MOUSE_EVENTS.mouseDown, e=>{
            surface.lineTo(e.screenX,e.screenY);
        });
        surface.on(MOUSE_EVENTS.mousePressed, e=>{
            surface.clear();
        });
    }

}
