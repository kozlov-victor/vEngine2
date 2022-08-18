import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Size} from "@engine/geometry/size";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

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

        const rect = new Rectangle(this.game);
        rect.fillColor = ColorFactory.fromCSS('#5128b1');
        rect.pos.setXY(200);
        this.appendChild(rect);


        const surface:DrawingSurface = new DrawingSurface(this.game,new Size(100,100));
        surface.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(surface);

        surface.drawBatch(session=>{
            surface.setLineWidth(0);
            surface.setFillColor(244,24,24, 100);
            session.drawRect(0,0,100,100);

            surface.setFillColor(0,24,24, 200);
            surface.setLineWidth(5);
            surface.setDrawColor(6,25,255);
            session.drawRect(50,50,30,30);

            surface.setFillColor(0,0,244, 200);
            surface.setDrawColor(255,25,12, 100);
            session.drawCircle(33,33,34);

            surface.setFillColor(20,90,12, 100);
            surface.setLineWidth(0);
            session.drawEllipse(53,83,20,40);

            session.moveTo(12,12);
            surface.setLineWidth(3);
            surface.setDrawColor(0,220,0, 200);
            session.lineTo(40,40);
            session.completePolyline();
        });




    }

}
