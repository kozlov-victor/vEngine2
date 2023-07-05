import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SvgImage} from "../svgBasic/svg/svgImage";
import {TaskQueue} from "@engine/resources/taskQueue";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {XmlParser} from "@engine/misc/parsers/xml/xmlParser";

// https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/
const imageUrls:string[] = [
    '18','22', '23',
    '19', '20', '21', '15', '16', '17',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14',
]


export class MainScene extends Scene {

    public override onReady():void {
        let i = 0;
        let lastImage:SvgImage;
        let loading:boolean = false;

        const placeNextImage = async ()=>{
            if (loading) return;
            loading = true;
            if (lastImage!==undefined) lastImage.removeSelf();
            const queue = new TaskQueue(this.game);
            const doc = await new ResourceLoader(this.game).loadXML(XmlParser,'./svgBasic7/examples/'+imageUrls[i]+'.svg');
            lastImage = await SvgImage.create(this.game,queue,doc,this.game.size);
            this.appendChild(lastImage);
            console.log(lastImage);
            i++;
            i = i%imageUrls.length;
            loading = false;
        };

        placeNextImage().catch(e=>console.log(e));
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>placeNextImage());
    }
}