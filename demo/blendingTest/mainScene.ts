import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class MainScene extends Scene {



    public override onReady():void {

        const rect = new Rectangle(this.game);
        rect.fillColor = ColorFactory.fromCSS('#000');
        rect.size.setWH(200,100);
        this.appendChild(rect);

        const rect2 = new Rectangle(this.game);
        rect2.size.setWH(200,200);
        rect2.pos.setXY(100,100);
        rect2.fillColor = ColorFactory.fromCSS('rgba(186,47,47,0.1)');
        rect2.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect2);
    }

}
