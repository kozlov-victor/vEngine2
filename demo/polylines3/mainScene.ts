import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";


export class MainScene extends Scene {



    public onPreloading() {

        const polyLine1:PolyLine = new PolyLine(this.game);
        //polyLine1.pos.setXY(81,68);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        polyLine1.setSvgPath(`
           M80 80
           A 45 45, 0, 0, 0, 125 125
           L 125 80 Z
           `
        );
        polyLine1.complete();
        polyLine1.setSvgPath(`
           M230 80
           A 45 45, 0, 1, 0, 275 125
           L 275 80 Z
        `);
        polyLine1.complete();
        polyLine1.setSvgPath(`
           M80 230
           A 45 45, 0, 0, 1, 125 275
           L 125 230 Z
        `);
        polyLine1.complete();
        polyLine1.setSvgPath(`
           M230 230
           A 45 45, 0, 1, 1, 275 275
           L 275 230 Z
        `);
        polyLine1.complete();
        polyLine1.setSvgPath(`
            M10 315
            L 110 215
            A 30 50 0 0 1 162.55 162.45
            L 172.55 152.45
            A 30 50 -45 0 1 215.1 109.9
            L 315 10
        `);


        polyLine1.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyLine1);


        const p:Polygon = new Polygon(this.game);
        p.fromSvgPath(`
            M100,10L105.8,27.2 
            123.8,27.2 109.4,38
            114.6,55.2 100,45 85.4,55.2 90.6,38
            76.2,27.2 94.2,27.2z
        `);
        p.addBehaviour(new DraggableBehaviour(this.game));
        p.fillColor = Color.RGB(122,12,12);
        this.appendChild(p);

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
