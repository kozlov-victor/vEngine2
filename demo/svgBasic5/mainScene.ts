import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SvgImage} from "../svgBasic/svgImage";
import {TaskQueue} from "@engine/resources/taskQueue";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {XmlParser} from "@engine/misc/parsers/xml/xmlParser";

// https://www.javatpoint.com/svg-tutorial
const imageUrls:string[] = [
    'Bananas','cat',
    'battery-charging', 'dial', 'home', 'phone', 'sim-card','sms',
    'hg', 'http', 'php', 'rack',
    'info', 'glifs','flower', 'passport2',
    'guide', 'us-bank-icon', 'tide','test-fill-non-zero','test-fill-even-odd',
    '1','2','3', '4', '5', '6', '7', '8', '9', '10',
    '11','12','13', '14', '15', '16', '17', '18', '19', '20',
    '21',
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
            const doc = await new ResourceLoader(this.game).loadXML(XmlParser,'./svgBasic5/examples/'+imageUrls[i]+'.svg');
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
