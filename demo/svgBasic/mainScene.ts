import * as svgTiger from "xml/xml-loader!./examples/tiger.svg";

// https://www.w3schools.com/graphics/svg_circle.asp
import * as svgCircle from "xml/xml-loader!./examples/circle.svg";
import * as svgCircle2 from "xml/xml-loader!./examples/circle2.svg";
import * as svgRect from "xml/xml-loader!./examples/rect.svg";
import * as svgRect2 from "xml/xml-loader!./examples/rect2.svg";
import * as svgRect3 from "xml/xml-loader!./examples/rect3.svg";
import * as svgEllipse from "xml/xml-loader!./examples/ellipse.svg";
import * as svgEllipse2 from "xml/xml-loader!./examples/ellipse2.svg";
import * as svgEllipse3 from "xml/xml-loader!./examples/ellipse3.svg";
import * as svgLine from "xml/xml-loader!./examples/line.svg";
import * as svgPolygon1 from "xml/xml-loader!./examples/polygon1.svg";
import * as svgPolyline1 from "xml/xml-loader!./examples/polyline1.svg";

// https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/
import * as svgEx1 from "xml/xml-loader!./examples/ex1.svg";
import * as svgEx2 from "xml/xml-loader!./examples/ex2.svg";
import * as svgEx3 from "xml/xml-loader!./examples/ex3.svg";
import * as svgEx4 from "xml/xml-loader!./examples/ex4.svg";
import * as svgEx5 from "xml/xml-loader!./examples/ex5.svg";
import * as svgEx6 from "xml/xml-loader!./examples/ex6.svg";
import * as svgEx7 from "xml/xml-loader!./examples/ex7.svg";
import * as svgEx8 from "xml/xml-loader!./examples/ex8.svg";
import * as svgEx9 from "xml/xml-loader!./examples/ex9.svg";
import * as svgEx10 from "xml/xml-loader!./examples/ex10.svg";
import * as svgEx11 from "xml/xml-loader!./examples/ex11.svg";
import * as svgEx12 from "xml/xml-loader!./examples/ex12.svg";
import * as svgEx13 from "xml/xml-loader!./examples/ex13.svg";
import * as svgEx14 from "xml/xml-loader!./examples/ex14.svg";
import * as svgEx15 from "xml/xml-loader!./examples/ex15.svg";
import * as svgEx16 from "xml/xml-loader!./examples/ex16.svg";
import * as svgEx17 from "xml/xml-loader!./examples/ex17.svg";
import * as svgEx18 from "xml/xml-loader!./examples/ex18.svg";
import * as svgEx19 from "xml/xml-loader!./examples/ex19.svg";
import * as svgEx20 from "xml/xml-loader!./examples/ex20.svg";
import * as svgEx21 from "xml/xml-loader!./examples/ex21.svg";
import * as svgEx22 from "xml/xml-loader!./examples/ex22.svg";
import * as svgEx23 from "xml/xml-loader!./examples/ex23.svg";
import * as svgEx24 from "xml/xml-loader!./examples/ex24.svg";
import * as svgEx25 from "xml/xml-loader!./examples/ex25.svg";
import * as svgEx26 from "xml/xml-loader!./examples/ex26.svg";
import * as svgEx27 from "xml/xml-loader!./examples/ex27.svg";

// https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/svg.svg - "use" is not supported

import {Scene} from "@engine/scene/scene";
import {SvgImage} from "./svgImage";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Element} from "@engine/misc/xmlUtils";

const images:Element[] = [
    svgEx27,
    svgEx11, svgEx12, svgEx13,svgEx14,
    svgEx15, svgEx16, svgEx17,svgEx18,
    svgEx19, svgEx20, svgEx21, svgEx22,
    svgEx23, svgEx24, svgEx25, svgEx26,
    svgEx6,svgEx7,svgEx8,
    svgEx9,svgEx10,
    svgPolyline1,
    svgPolygon1,
    svgEx4,svgEx5,
    svgRect,svgRect2,svgRect3,svgTiger,svgCircle,svgCircle2,svgEllipse,
    svgEllipse2,svgEllipse3,svgLine,
    svgEx1,svgEx2, svgEx3,
];

export class MainScene extends Scene {

    onReady():void {
        let i = 0;
        let lastImage:SvgImage;

        const placeNextImage = ()=>{
            if (lastImage!==undefined) lastImage.removeSelf();
            lastImage = new SvgImage(this.game,images[i]);
            this.appendChild(lastImage);
            i++;
            i = i%images.length;
        };

        placeNextImage();
        this.on(MOUSE_EVENTS.click, ()=>placeNextImage());
    }
}
