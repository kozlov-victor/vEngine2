import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {



    public onReady():void {

        const rect = new Rectangle(this.game);
        rect.fillColor = Color.fromCssLiteral('#000');
        rect.size.setWH(200,100);
        this.appendChild(rect);

        const rect2 = new Rectangle(this.game);
        rect2.size.setWH(200,200);
        rect2.pos.setXY(100,100);
        rect2.fillColor = Color.fromCssLiteral('rgba(186,47,47,0.1)');
        rect2.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(rect2);
    }

}
