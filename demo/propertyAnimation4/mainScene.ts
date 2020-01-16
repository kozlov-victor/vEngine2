import {Scene} from "@engine/scene/scene";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MoveByPathAnimation} from "@engine/animation/propertyAnimation/moveByPathAnimation";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";

export class MainScene extends Scene {

    public onReady() {
        const model = new Circle(this.game);
        model.radius = 15;
        model.color.setRGB(2,244,34);
        model.lineWidth = 5;
        this.appendChild(model);
        model.anchor.setToCenter();

        const polyLine1:PolyLine = new PolyLine(this.game);
        // created with https://editor.method.ac/
        polyLine1.fromSvgPath(`
           M 61.5 29.453125 C 54.5 70.453125 40.5 57.453125 48.5 106.453125 C 56.5 155.453125 35.5 129.453125 63.5 178.453125 C 91.5 227.453125 72.5 211.453125 106.5 245.453125 C 140.5 279.453125 122.5 270.453125 169.5 291.453125 C 216.5 312.453125 220.5 319.453125 254.5 328.453125 C 288.5 337.453125 322.5 341.453125 355.5 335.453125 C 388.5 329.453125 441.5 306.453125 453.5 291.453125 C 465.5 276.453125 471.5 269.453125 474.5 253.453125 C 477.5 237.453125 489.5 219.453125 485.5 203.453125 C 481.5 187.453125 490.5 156.453125 478.5 149.453125 C 466.5 142.453125 451.5 131.453125 447.5 132.453125 C 443.5 133.453125 420.5 137.453125 408.5 148.453125 C 396.5 159.453125 376.5 169.453125 368.5 175.453125 C 360.5 181.453125 342.5 190.453125 325.5 197.453125 C 308.5 204.453125 268.5 216.453125 254.5 219.453125 C 240.5 222.453125 210.5 230.453125 207.5 211.453125 C 204.5 192.453125 204.5 182.453125 204.5 175.453125 C 204.5 168.453125 208.5 145.453125 213.5 143.453125 C 218.5 141.453125 229.5 134.453125 241.5 135.453125 C 253.5 136.453125 295.5 131.453125 301.5 126.453125 C 307.5 121.453125 330.5 101.453125 319.5 91.453125 C 308.5 81.453125 312.5 76.453125 290.5 68.453125 C 268.5 60.453125 251.5 54.453125 237.5 49.453125 C 223.5 44.453125 179.5 32.453125 172.5 32.453125 C 165.5 32.453125 116.5 20.453125 112.5 25.453125 C 108.5 30.453125 103.5 50.453125 97.5 52.453125 C 91.5 54.453125 86.5 54.453125 80.5 40.453125 C 74.5 26.453125 68.5 -11.546875 61.5 29.453125 z
           `
        );

        this.appendChild(polyLine1);

        const anim1 = new MoveByPathAnimation(this.game,polyLine1);
        anim1.velocity = 50;
        this.addPropertyAnimation(anim1);

        anim1.onProgress((p)=>{
            model.pos.set(p);
        });

    }

}
