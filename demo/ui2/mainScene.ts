import {Scene} from "@engine/scene/scene";
import {Container} from "@engine/renderable/impl/ui2/container";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {

    public onReady() {

        const bg = new Rectangle(this.game);
        bg.fillColor = Color.RGB(12,122,4);
        bg.borderRadius = 10;

        const container:Container = new Container(this.game);
        container.size.set(this.game.size);
        container.setBackground(bg);
        container.setMargin(50,10);
        this.appendChild(container);

    }

}
