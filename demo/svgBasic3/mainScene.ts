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
import * as svgEx28 from "xml/xml-loader!./examples/ex28.svg";
import * as svgEx29 from "xml/xml-loader!./examples/ex29.svg";
import * as svgEx30 from "xml/xml-loader!./examples/ex30.svg";
import * as svgEx31 from "xml/xml-loader!./examples/ex31.svg";
import * as svgEx32 from "xml/xml-loader!./examples/ex32.svg";
import * as svgEx33 from "xml/xml-loader!./examples/ex33.svg";
import * as svgEx34 from "xml/xml-loader!./examples/ex34.svg";
import * as svgEx35 from "xml/xml-loader!./examples/ex35.svg";
import * as svgEx36 from "xml/xml-loader!./examples/ex36.svg";
import * as svgEx37 from "xml/xml-loader!./examples/ex37.svg";
import * as svgEx38 from "xml/xml-loader!./examples/ex38.svg";
import * as svgEx39 from "xml/xml-loader!./examples/ex39.svg";


import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SvgImage} from "../svgBasic/svgImage";
import {TaskQueue} from "@engine/resources/taskQueue";
import {XmlDocument} from "@engine/misc/parsers/xml/xmlELements";

const images:XmlDocument[] = [

    svgEx36,svgEx37,svgEx38,svgEx39,

    svgEx34,
    svgEx27,svgEx28,svgEx29,
    svgEx30, svgEx31, svgEx32,

    svgEx33,svgEx34,svgEx35,

    svgEx22,svgEx23, svgEx24,svgEx25,
    svgEx26,

    svgEx18,svgEx19, svgEx20,svgEx21,

    svgEx15,svgEx16,svgEx17,
    svgEx12,svgEx13,svgEx14,
    svgEx10,svgEx11, svgEx12,


    svgEx1,svgEx2,svgEx3,svgEx4,
    svgEx5,svgEx6,svgEx7,svgEx8,
    svgEx9,
];

export class MainScene extends Scene {

    public override onReady():void {
        let i = 0;
        let lastImage:SvgImage;

        const placeNextImage = async ()=>{
            if (lastImage!==undefined) lastImage.removeSelf();
            const queue = new TaskQueue(this.game);
            lastImage = await SvgImage.create(this.game,queue,images[i]);
            this.appendChild(lastImage);
            console.log(lastImage);
            i++;
            i = i%images.length;
        };

        placeNextImage();
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>placeNextImage());
    }
}
