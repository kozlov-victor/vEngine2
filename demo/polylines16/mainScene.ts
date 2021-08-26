import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TaskQueue} from "@engine/resources/taskQueue";
import {triangulatedPathFromPolyline} from "@engine/renderable/impl/geometry/_internal/triangulatedPathFromPolyline";
import {EndCapStyle} from "@engine/renderable/impl/geometry/_internal/polyline-triangulate/polylineTriangulator";


export class MainScene extends Scene {


    public override onPreloading(taskQueue:TaskQueue):void {

        // curve from https://habr.com/ru/post/450924/
        // const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
        //     M 0 0 c 3.4 -6.8 27.8 -54.2 56 -37.7 C 73.3 -27.5 89.6 -5.1 81.9 5.9 c -5.8 8.3 -24.7 8.7 -45.4 -0.4
        //     `
        // );

        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
            M 65.123 95.514 C 71.018 89.619 71.499 81.246 77.424 72.359 C 79.427 69.355 83.213 65.239 83.213 64.399 C 97.987 69.324 111.592 77.255 126.628 81.766 C 141.892 86.345 158.583 86.107 174.385 86.107 C 177.631 86.107 185.778 87.647 188.857 86.107 C 192.711 84.18 182.456 70.896 181.621 69.465 C 178.852 64.717 175.332 52.572 170.043 49.928 C 162.343 46.077 147.771 46.691 138.929 45.586 C 119.508 43.158 102.858 40.521 82.489 40.521 C 68.48 36.114 52.742 28.22 41.245 28.22
            `
        );

        polyLine1.pos.setXY(100,100);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        //this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));


        const mesh2 = triangulatedPathFromPolyline(this.game,polyLine1,{thickness:12,endCapStyle:EndCapStyle.ROUND});
        mesh2.size.setWH(300,300);
        mesh2.addBehaviour(new DraggableBehaviour(this.game));
        mesh2.fillColor = polyLine1.color;
        mesh2.pos.set(polyLine1.pos);
        mesh2.alpha = 0.8;
        this.appendChild(mesh2);

    }

}
