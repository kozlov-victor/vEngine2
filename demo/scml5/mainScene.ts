import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SpriterObject} from "../scml/scml";
import {TaskQueue} from "@engine/resources/taskQueue";

// models: https://github.com/treefortress/SpriterAS
// https://github.com/ibilon/HaxePunk-Spriter/tree/master/demo/assets/sprites


export class MainScene extends Scene {

    private player:SpriterObject;
    private mage:SpriterObject;
    private imp:SpriterObject;
    private brawler:SpriterObject;

    public onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        taskQueue.addNextTask(async _=>{
            this.player = await SpriterObject.create(this.game,taskQueue,'./scml5/orc/orc.scon');
        });
        taskQueue.addNextTask(async _=>{
            this.mage = await SpriterObject.create(this.game,taskQueue,'./scml5/mage/mage.scon');
        });
        taskQueue.addNextTask(async _=>{
            this.imp =await SpriterObject.create(this.game,taskQueue,'./scml5/imp/imp.scon');
        });
        taskQueue.addNextTask(async _=>{
            this.brawler = await SpriterObject.create(this.game,taskQueue,'./scml5/brawler/brawler.scon');
        });
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {


        this.appendChild(this.player);
        this.player.scale.setXY(0.6);
        this.player.pos.setXY(200,200);

        this.appendChild(this.mage);
        this.mage.scale.setXY(0.6);
        this.mage.pos.setXY(100,100);

        this.appendChild(this.imp);
        this.imp.scale.setXY(0.6);
        this.imp.pos.setXY(500,100);

        this.appendChild(this.brawler);
        this.brawler.scale.setXY(0.6);
        this.brawler.pos.setXY(500,300);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>{
            this.player.nextAnimation();
            this.mage.nextAnimation();
            this.imp.nextAnimation();
            this.brawler.nextAnimation();
        });
    }

}
