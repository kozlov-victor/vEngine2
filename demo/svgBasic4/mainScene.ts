import * as tbl from "xml/xml-loader!./examples/tbl-1.svg";


import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SvgImage} from "../svgBasic/svgImage";
import {TaskQueue} from "@engine/resources/taskQueue";
import {XmlDocument} from "@engine/misc/xml/xmlELements";

const images:XmlDocument[] = [
    tbl
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
