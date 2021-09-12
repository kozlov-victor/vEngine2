import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Optional} from "@engine/core/declarations";

export class MainScene extends Scene {

    public override onPreloading():void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(surface);
        surface.setDrawColor(120,222,200);
        let oldX:Optional<number>;
        let oldY:Optional<number>;
        surface.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            if (e.isMouseDown) {
                if (oldX===undefined) oldX = e.screenX;
                if (oldY===undefined) oldY = e.screenY;
                const width = (e.nativeEvent as PointerEvent).pressure*6 || 2;
                surface.setLineWidth(width);
                surface.moveTo(oldX,oldY);
                surface.lineTo(e.screenX,e.screenY);
                surface.completePolyline();
                oldX = e.screenX;
                oldY = e.screenY;
            }
        });
        surface.mouseEventHandler.on(MOUSE_EVENTS.mouseDown, e=>{
            surface.moveTo(e.screenX,e.screenY);
        });
        surface.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, e=>{
            oldX = undefined;
            oldY = undefined;
        });
        surface.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, e=>{
            oldX = undefined;
            oldY = undefined;
        });
        surface.mouseEventHandler.on(MOUSE_EVENTS.mousePressed, e=>{
            surface.clear();
        });
    }

}
