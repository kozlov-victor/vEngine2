import {Scene} from "@engine/model/impl/general/scene";
import {Polygon} from "@engine/model/impl/geometry/polygon";
import {Color} from "@engine/renderer/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {MouseControl} from "@engine/control/mouse/mouseControl";

export class MainScene extends Scene {

    public onPreloading() {
        this.game.addControl(MouseControl);
    }

    public onReady() {
        const p:Polygon = new Polygon(this.game);
        p.fromSvgPath(`
            M66.039,133.545c0,0-21-57,18-67s49-4,65,8
            s30,41,53,27s66,4,58,32s-5,44,18,57s22,46,0,45s-54-40-68-16s-40,88-83,48s11-61-11-80s-79-7-70-41
            C46.039,146.545,53.039,128.545,66.039,133.545z
        `);
        p.fillColor = Color.RGB(122,12,0);
        p.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(p);
        p.setRotationPointToCenter();
        this.setInterval(()=>{
            p.angle3d.x+=0.01;
            p.angle3d.y+=0.01;
        },10);

    }

}
