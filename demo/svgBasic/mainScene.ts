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


import {Scene} from "@engine/scene/scene";
import {SvgImage} from "./svgImage";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Element} from "@engine/misc/xmlUtils";

const images:Element[] = [
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
