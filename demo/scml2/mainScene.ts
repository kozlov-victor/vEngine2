import {Scene} from "@engine/scene/scene";
import {SpriterObject} from "../scml/scml";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private lobster:SpriterObject;

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        taskQueue.addNextTask(async progress=>{
            this.lobster = await SpriterObject.create(this.game,taskQueue,'./scml2/lobster/lobster.scon');
        });
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {

        document.body.style.cssText = 'background-color:grey;';

        this.appendChild(this.lobster);
        this.lobster.pos.setXY(120,120);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>{
            this.lobster.nextAnimation();
        });

    }

}
