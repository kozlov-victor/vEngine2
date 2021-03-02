import {SpriterObject} from "./scml";
import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private player:SpriterObject;

    public onPreloading(taskQueue:TaskQueue):void {
       taskQueue.addNextTask(async progress=>{
          this.player =
              await SpriterObject.create(
                  this.game,
                  taskQueue,
                  {url:'./scml/player/player.scon',headers:[{name:'test-header',value:'nonsense'}],responseType:'text'}
              );
       });
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {


        this.appendChild(this.player);
        this.player.scale.setXY(0.6);
        this.player.pos.setXY(200,200);

        this.on(MOUSE_EVENTS.click, ()=>this.player.nextAnimation());
    }

}
