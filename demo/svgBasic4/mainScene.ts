import * as tbl from "xml/xml-loader!./examples/tbl-1.svg";


import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SvgImage} from "../svgBasic/svgImage";
import {TaskQueue} from "@engine/resources/taskQueue";
import {XmlDocument} from "@engine/misc/parsers/xml/xmlELements";
import {CrtScreenFilter} from "@engine/renderer/webGl/filters/texture/crtScreenFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {SepiaColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/sepiaColorMatrixFilter";

const images:XmlDocument[] = [
    tbl
];

export class MainScene extends Scene {

    public override onReady():void {

        const sepia = new SepiaColorMatrixFilter(this.game);

        this.filters = [new CrtScreenFilter(this.game),new NoiseHorizontalFilter(this.game),sepia];
        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
           this.game.getRenderer().requestFullScreen();
           sepia.enabled=!sepia.enabled;
        });

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
