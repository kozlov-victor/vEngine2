import {Scene} from "@engine/model/impl/general/scene";
import {Polygon} from "@engine/model/impl/geometry/polygon";
import {Color} from "@engine/renderer/color";

export class MainScene extends Scene {

    public onPreloading() {

    }

    public onReady() {
        const p:Polygon = new Polygon(this.game);
        p.setVertices([
            0,0,
            0,100,
            100,100,
        ]);
        p.fillColor = Color.RGB(255,0,0);
        this.appendChild(p);
    }

}
