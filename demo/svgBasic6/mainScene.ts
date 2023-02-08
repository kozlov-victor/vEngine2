import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SvgImage} from "../svgBasic/svg/svgImage";
import {TaskQueue} from "@engine/resources/taskQueue";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {XmlParser} from "@engine/misc/parsers/xml/xmlParser";

// https://www.javatpoint.com/svg-tutorial
const imageUrls:string[] = [
    'test1','car-lite',
    'illustration-1','happy', 'with-css',
    'curve-test','curve-test-2','curve-test-3','curve-test-4','curve-test-5',
    'test-draw',
    'cpu','dino',
    'ua','WhatsApp','food-orange-svgrepo-com',
    'homer-simpson','merge-svgrepo-com','flower'
];


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
            const doc = await new ResourceLoader(this.game).loadXML(XmlParser,'./svgBasic6/examples/'+imageUrls[i]+'.svg');
            lastImage = await SvgImage.create(this.game,queue,doc,this.game.size);
            this.appendChild(lastImage);
            console.log(lastImage);
            i++;
            i = i%imageUrls.length;
            loading = false;
        };

        placeNextImage().catch(e=>{
            console.log(e);
            window.onerror?.(e);
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>placeNextImage());
    }
}
