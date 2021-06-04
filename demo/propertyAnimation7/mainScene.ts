import {Scene} from "@engine/scene/scene";
import {MoveByPathAnimation} from "@engine/animation/propertyAnimation/moveByPathAnimation";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Circle} from "@engine/renderable/impl/geometry/circle";

export class MainScene extends Scene {

    public override onReady():void {
        const model = new Circle(this.game);
        model.radius = 10;
        model.color.setRGB(255,99,71); // "tomato"
        model.lineWidth = 5;
        this.appendChild(model);
        model.anchorPoint.setToCenter();
        model.transformPoint.setToCenter();

        // https://css-live.ru/articles/rukovodstvo-po-svg-animaciyam-smil.html
        // https://codepen.io/SaraSoueidan/pen/ef9f0e1242263cf23067b09be894cfa9
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M202.4,58.3c-13.8,0.1-33.3,0.4-44.8,9.2
            c-14,10.7-26.2,29.2-31.9,45.6c-7.8,22.2-13.5,48-3.5,70.2c12.8,28.2,47.1,43.6,68.8,63.6c19.6,18.1,43.4,26.1,69.5,29.4
            c21.7,2.7,43.6,3.3,65.4,4.7c19.4,1.3,33.9-7.7,51.2-15.3c24.4-10.7,38.2-44,40.9-68.9c1.8-16.7,3.4-34.9-10.3-46.5
            c-9.5-8-22.6-8.1-33.2-14.1c-13.7-7.7-27.4-17.2-39.7-26.8c-5.4-4.2-10.4-8.8-15.8-12.9c-4.5-3.5-8.1-8.3-13.2-11
            c-6.2-3.3-14.3-5.4-20.9-8.2c-5-2.1-9.5-5.2-14.3-7.6c-6.5-3.3-12.1-7.4-19.3-8.9c-6-1.2-12.4-1.3-18.6-1.5
            C222.5,59,212.5,57.8,202.4,58.3
           `
        );
        this.appendChild(polyLine1.cacheAsBitmap());

        const anim1 = new MoveByPathAnimation(this.game,polyLine1);
        //anim1.velocity = 50;
        anim1.durationSec = 5;
        anim1.rotate = true;
        model.addPropertyAnimation(anim1);
    }

}
