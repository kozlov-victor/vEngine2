
import * as svgEx1 from "xml/xml-loader!./examples/illustrator-test-1.svg";
import * as svgEx2 from "xml/xml-loader!./examples/illustrator-test-2.svg";
import * as svgEx3 from "xml/xml-loader!./examples/illustractor-export-test1.svg";
import * as svgEx4 from "xml/xml-loader!./examples/illustractor-export-test2.svg";
import * as svgEx5 from "xml/xml-loader!./examples/heart.svg";
import * as svgEx6 from "xml/xml-loader!./examples/dragon.svg";
import * as svgEx7 from "xml/xml-loader!./examples/dragon2.svg";


import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Element} from "@engine/misc/xmlUtils";
import {SvgImage} from "../svgBasic/svgImage";

const images:Element[] = [
    svgEx6,svgEx7,
    svgEx1,svgEx2, svgEx3, svgEx4, svgEx5,
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
