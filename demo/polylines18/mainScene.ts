import {Scene} from "@engine/scene/scene";
import {PolyLines} from "@engine/renderable/impl/geometry/polyLines";
import {Color} from "@engine/renderer/common/color";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {


    // https://gamesnacks.com/embed/static/media/powered_by.855b1bc9.svg
    public override onReady():void {

        const s1 = new Ellipse(this.game);
        s1.radiusX = 100;
        s1.radiusY = 50;
        s1.fillColor = ColorFactory.fromCSS('#b0b0f6');
        s1.pos.setXY(100,100);
        this.appendChild(s1);
        const p1 = PolyLines.createEllipse(this.game,100,50);
        p1.color.setFrom(ColorFactory.fromCSS('#bc3636'));
        p1.pos.setXY(100,100);
        this.appendChild(p1);

        const s2 = new Rectangle(this.game);
        s2.size.setWH(150,60);
        s2.borderRadius = 10;
        s2.fillColor = ColorFactory.fromCSS('#f5e1e1');
        s2.pos.setXY(10,10);
        this.appendChild(s2);
        const p2 = PolyLines.createRoundedRect(this.game,150,60,10);
        p2.pos.setXY(10,10);
        this.appendChild(p2);

    }

}
