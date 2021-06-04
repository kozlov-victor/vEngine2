import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SpriterObject} from "../scml/scml";
import {TaskQueue} from "@engine/resources/taskQueue";

// https://github.com/loudoweb/Spriter-Example

export class MainScene extends Scene {

    private player:SpriterObject;

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        taskQueue.addNextTask(async _=>{
           this.player = await SpriterObject.create(this.game,taskQueue,'./scml4/ugly/ugly.scon');
        });
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        this.appendChild(this.player);
        this.player.scale.setXY(0.6);
        this.player.pos.setXY(200,200);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>this.player.nextAnimation());
    }

}
