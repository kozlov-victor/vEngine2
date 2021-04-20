import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";
import {TaskQueue} from "@engine/resources/taskQueue";
import {wait} from "../longLoading/mainScene";

export class SecondScene extends Scene {

    public onPreloading(taskQueue:TaskQueue):void{
        super.onPreloading(taskQueue);
        for (let i:number = 0;i<20;i++) {
            taskQueue.addNextTask(async progress=>{
                await wait(progress);
            });
        }
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const rect:Rectangle = new Rectangle(this.game);
        rect.pos.setXY(50,50);
        rect.size.setWH(120,220);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, e=>{
            this.game.popScene();
        });
        this.appendChild(rect);
        this.filters = [new Barrel2DistortionFilter(this.game)];
    }

}
