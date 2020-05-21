import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {Size} from "@engine/geometry/size";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {



    public onPreloading() {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,new Size(100,100));
        surface.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(surface);
        surface.setLineWidth(0);
        surface.setFillColor(244,24,24);
        surface.drawRect(0,0,100,100);

        surface.setFillColor(0,24,24);
        surface.setLineWidth(5);
        surface.setDrawColor(6,25,255);
        surface.drawRect(50,50,30,30);

        surface.setFillColor(0,0,244);
        surface.drawCircle(33,33,34);

        surface.setFillColor(20,90,12, 122);
        surface.setLineWidth(0);
        surface.drawEllipse(53,83,20,40);

        surface.moveTo(12,12);
        surface.setDrawColor(0,220,0);
        surface.lineTo(40,40);

    }

}
