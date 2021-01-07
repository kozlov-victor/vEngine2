import * as svgEx1 from "xml/xml-loader!./examples/illustrator-test-1.svg";
import * as svgEx2 from "xml/xml-loader!./examples/illustrator-test-2.svg";
import * as svgEx9 from "xml/xml-loader!./examples/illustrator-test-3.svg";
import * as svgEx3 from "xml/xml-loader!./examples/illustractor-export-test1.svg";
import * as svgEx4 from "xml/xml-loader!./examples/illustractor-export-test2.svg";
import * as svgEx10 from "xml/xml-loader!./examples/illustractor-export-test3.svg";
import * as svgEx5 from "xml/xml-loader!./examples/heart.svg";
import * as svgEx6 from "xml/xml-loader!./examples/dragon.svg";
import * as svgEx7 from "xml/xml-loader!./examples/dragon2.svg";
import * as svgEx8 from "xml/xml-loader!./examples/icon-2.svg";
import * as svgEx11 from "xml/xml-loader!./examples/frame1.svg";
import * as svgEx12 from "xml/xml-loader!./examples/person.svg";
import * as svgEx13 from "xml/xml-loader!./examples/test-1.svg";
import * as svgEx14 from "xml/xml-loader!./examples/test-2.svg";


import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Element} from "@engine/misc/xmlUtils";
import {SvgImage} from "../svgBasic/svgImage";

const images:Element[] = [
    svgEx12,svgEx11,svgEx13,svgEx14,
    svgEx9,svgEx10,
    svgEx6,svgEx7,svgEx8,
    svgEx1,svgEx2, svgEx3, svgEx4, svgEx5,
];

export class MainScene extends Scene {

    onReady():void {

        let i = 0;
        let lastImage:SvgImage;

        const placeNextImage = async ()=>{
            if (lastImage!==undefined) lastImage.removeSelf();
            lastImage = new SvgImage(this.game,images[i]);
            await lastImage.parse();
            this.appendChild(lastImage);
            i++;
            i = i%images.length;
        };

        placeNextImage();
        this.on(MOUSE_EVENTS.click, ()=>placeNextImage());
    }
}
