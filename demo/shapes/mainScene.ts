import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";


export class MainScene extends Scene {

    onPreloading() {
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
        this.appendChild(circle);

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.radiusX = 60;
        ellipse.radiusY = 40;
        gradient = new LinearGradient();
        gradient.colorFrom = Color.RGB(100,0,222);
        gradient.colorTo = Color.RGB(12,20,222);
        ellipse.fillColor = gradient;
        ellipse.color = Color.BLACK;
        ellipse.lineWidth = 5;
        ellipse.center.setXY(50,50);
        ellipse.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(ellipse);

    }

    onProgress(val: number) {

    }

    onReady() {
        console.log('ready');
    }

}
