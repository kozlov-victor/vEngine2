import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SpriterObject} from "../scml/scml";
import {TaskQueue} from "@engine/resources/taskQueue";

// models: https://craftpix.net/freebies/2d-fantasy-fairy-free-character-sprite/


export class MainScene extends Scene {

    private player:SpriterObject;


    public onPreloading(taskQueue:TaskQueue):void {
        taskQueue.addNextTask(async _=>{
            this.player = await SpriterObject.create(this.game,taskQueue,'./scml6/fair/1.scon');
        });
    }

    public onReady():void {

        this.appendChild(this.player);
        this.player.scale.setXY(0.3);
        this.player.pos.setXY(200,300);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>{
            this.player.nextAnimation();
        });
    }

}
