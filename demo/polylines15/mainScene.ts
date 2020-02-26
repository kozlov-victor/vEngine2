import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";


export class MainScene extends Scene {



    public onPreloading() {

        // model from https://codepen.io/SaraSoueidan/pen/48caf2f5fa42a8c154fcb5dec0dbe4d5
        this.appendChild(Polygon.fromSvgPath(this.game,`
            M234.4,182.8c-3.5,0-6.4,2.9-6.4,6.4c0,3.5,2.9,6.4,6.4,6.4c3.5,0,6.4-2.9,6.4-6.4C240.8,185.6,238,182.8,234.4,182.8z
        `));
        this.appendChild(Polygon.fromSvgPath(this.game,`
            M263,182.8c-3.5,0-6.4,2.9-6.4,6.4c0,3.5,2.9,6.4,6.4,6.4c3.5,0,6.4-2.9,6.4-6.4C269.4,185.6,266.6,182.8,263,182.8z
        `));
        this.appendChild(Polygon.fromSvgPath(this.game,`
            M275,171.4c-2.8-0.7-5.2-3-6.3-5.1l-3.9-7.4c-1.1-2.1-3.9-3.8-6.3-3.8h-22.6c-2.4,0-5,1.8-5.7,4.1l-2.4,7
            c-0.2,0.9-1.8,5.5-5,5.5c-2.4,0-5,3.1-5,5.5v8.2c0,2.4,1.9,4.3,4.3,4.3h4.5c0-0.2,0-0.3,0-0.5c0-4.3,3.5-7.8,7.8-7.8
            c4.3,0,7.8,3.5,7.8,7.8c0,0.2,0,0.3,0,0.5h13.1c0-0.2,0-0.3,0-0.5c0-4.3,3.5-7.8,7.8-7.8s7.8,3.5,7.8,7.8c0,0.2,0,0.3,0,0.5h8.1
            c2.4,0,4.3-1.9,4.3-4.3v-6.5C283.2,172,277.3,172,275,171.4z
        `));

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
