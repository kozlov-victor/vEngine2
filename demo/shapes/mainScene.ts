import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {RadialGradient} from "@engine/renderable/impl/fill/radialGradient";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.setColorAtPosition(0, Color.RGB(100,0,20));
        gradient.setColorAtPosition(1, Color.RGB(200,111,1));
        rect.fillGradient = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(40);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect);

        const circle:Circle = new Circle(this.game);
        circle.radius = 40;
        circle.center.setXY(50,50);
        circle.color = Color.RGB(30,40,55);
        circle.addBehaviour(new DraggableBehaviour(this.game));
        circle.lineWidth = 2;
        circle.color = Color.RGB(0,100,12);
        circle.fillColor = Color.RGBA(100,100,100,111);
        circle.arcAngleFrom = -2;
        circle.arcAngleTo = 2;
        this.appendChild(circle);

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.radiusX = 60;
        ellipse.radiusY = 40;
        const grad = new RadialGradient();
        grad.setColorAtPosition(0,Color.RGBA(100,0,222,200));
        grad.setColorAtPosition(0.5,Color.RGBA(200,0,222,200));
        grad.setColorAtPosition(1,Color.RGB(12,20,222));
        grad.center.setXY(0.1,0.2);
        ellipse.fillGradient = grad;
        ellipse.color = Color.BLACK;
        ellipse.lineWidth = 5;
        ellipse.center.setXY(50,50);
        ellipse.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(ellipse);

        // created with https://editor.method.ac/
        const polyline:PolyLine = PolyLine.fromSvgPath(this.game,`
        M 64.693 116.615 L 21.388 208.094 C -11.852 237.461 44.495 288.708 93.428 305.375 C 153.485 325.832 203.521 325.984 200.027 298.722 C 188.33 207.452 145.765 169.448 115.841 191.82 C 93.541 208.492 72.912 92.281 64.693 116.615 Z
        `,{lineWidth:10});
        //polyline.pos.setXY(100,100);
        polyline.color.setRGB(100,12,12);
        polyline.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyline);

        const polygon:Polygon = Polygon.fromPolyline(this.game,polyline);
        polygon.fillColor = Color.RGBA(12,233,33,122);
        polygon.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polygon);

        const star:Polygon = Polygon.createStar(this.game,5,40);
        star.fillColor  = Color.RGBA(222,33,122,122);
        star.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(star);
    }


    public override onReady():void {
        console.log('ready');
    }

}
