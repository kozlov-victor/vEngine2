import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";
import {Line} from "@engine/model/impl/ui/drawable/line";
import {PolyLine} from "@engine/model/impl/ui/drawable/polyLine";


export class MainScene extends Scene {

    public onPreloading() {
        const rect:Rectangle = new Rectangle(this.game);
        let gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.colorFrom = Color.RGB(100,0,20);
        gradient.colorTo = Color.RGB(200,111,1);
        rect.fillColor = gradient;
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
        circle.arcAngleFrom = -2;
        circle.arcAngleTo = 2;
        this.appendChild(circle);

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.radiusX = 60;
        ellipse.radiusY = 40;
        gradient = new LinearGradient();
        gradient.colorFrom = Color.RGB(100,0,222,200);
        gradient.colorTo = Color.RGB(12,20,222);
        ellipse.fillColor = gradient;
        ellipse.color = Color.BLACK;
        ellipse.lineWidth = 5;
        ellipse.center.setXY(50,50);
        ellipse.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(ellipse);

        // created with https://editor.method.ac/
        const polyline:PolyLine = new PolyLine(this.game);
        polyline.pos.setXY(100,100);
        polyline.lineWidth = 10;
        polyline.color = Color.RGB(100,12,12);
        polyline.setSvgPath(`
        M 64.693 116.615 L 21.388 208.094 C -11.852 237.461 44.495 288.708 93.428 305.375 C 153.485 325.832 203.521 325.984 200.027 298.722 C 188.33 207.452 145.765 169.448 115.841 191.82 C 93.541 208.492 72.912 92.281 64.693 116.615 Z
        `);
        polyline.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyline);

    }

    public onProgress(val: number) {

    }

    public onReady() {
        console.log('ready');
    }

}
