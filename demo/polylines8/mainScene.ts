import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {



    public override onPreloading(taskQueue:TaskQueue):void {

        // https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths

        // <svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
        //
        //     <path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
        //     <path d="M70 10 C 70 20, 120 20, 120 10" stroke="black" fill="transparent"/>
        //     <path d="M130 10 C 120 20, 180 20, 170 10" stroke="black" fill="transparent"/>
        //     <path d="M10 60 C 20 80, 40 80, 50 60" stroke="black" fill="transparent"/>
        //     <path d="M70 60 C 70 80, 110 80, 110 60" stroke="black" fill="transparent"/>
        //     <path d="M130 60 C 120 80, 180 80, 170 60" stroke="black" fill="transparent"/>
        //     <path d="M10 110 C 20 140, 40 140, 50 110" stroke="black" fill="transparent"/>
        //     <path d="M70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
        //     <path d="M130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent"/>
        //
        // </svg>


        PolyLine.fromMultiCurveSvgPath(this.game,`
                M10 10 C 20 20, 40 20, 50 10
                M70 10 C 70 20, 120 20, 120 10
                M130 10 C 120 20, 180 20, 170 10
                M10 60 C 20 80, 40 80, 50 60
                M70 60 C 70 80, 110 80, 110 60
                M130 60 C 120 80, 180 80, 170 60
                M10 110 C 20 140, 40 140, 50 110
                M70 110 C 70 140, 110 140, 110 110
                M130 110 C 120 140, 180 140, 170 110
        `).forEach(p=>{
            p.pos.setXY(0,0);
            p.color = Color.RGB(100,20,222);
            p.lineWidth = 2;
            this.appendChild(p);
        });



    }


}
