import {Scene} from "@engine/scene/scene";
import {SpriterObject} from "../scml/scml";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TaskQueue} from "@engine/resources/taskQueue";

// https://github.com/miletbaker/spriter2moai

export class MainScene extends Scene {

    private monster:SpriterObject;

    public override onPreloading(taskQueue:TaskQueue):void {
        taskQueue.addNextTask(async progress=>{
            this.monster = await SpriterObject.create(this.game,taskQueue,'./scml3/monster/monster.scon',progress);
        });
    }

    public override onReady():void {

        this.appendChild(this.monster);
        this.monster.scale.setXY(0.7);
        this.monster.pos.setXY(120,600);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>this.monster.nextAnimation());

    }

}
