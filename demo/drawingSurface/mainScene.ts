import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Size} from "@engine/geometry/size";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

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
        const surface:DrawingSurface = new DrawingSurface(this.game,new Size(100,100));
        surface.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(surface);

        surface.drawBatch(session=>{
            surface.setLineWidth(0);
            surface.setFillColor(244,24,24);
            session.drawRect(0,0,100,100);

            surface.setFillColor(0,24,24);
            surface.setLineWidth(5);
            surface.setDrawColor(6,25,255);
            session.drawRect(50,50,30,30);

            surface.setFillColor(0,0,244);
            session.drawCircle(33,33,34);

            surface.setFillColor(20,90,12, 122);
            surface.setLineWidth(0);
            session.drawEllipse(53,83,20,40);

            session.moveTo(12,12);
            surface.setDrawColor(0,220,0);
            session.lineTo(40,40);
        });




    }

}
