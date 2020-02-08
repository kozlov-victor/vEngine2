
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {ResourceLink} from "@engine/resources/resourceLink";

export class MainScene extends Scene {

    private fontJsonLink:ResourceLink<any>;

    // https://gero3.github.io/facetype.js/
    public onPreloading() {
        this.fontJsonLink = this.resourceLoader.loadJSON('./polylines12/Mortal Kombat 4_Regular.json');
    }

    public onProgress(val: number) {

    }

    public onReady() {

        const path = this.fontJsonLink.getTarget().glyphs.a.o.toUpperCase();
        console.log(path);

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,path);

        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.scale.setXY(0.5,0.5);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

}
