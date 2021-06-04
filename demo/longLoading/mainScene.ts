import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {TaskQueue} from "@engine/resources/taskQueue";

export const wait = (progress:(n:number)=>void):Promise<void>=>{
    return new Promise<void>(resolve=>{
        let cnt = 0;
        const tmr =setInterval(()=>{
            cnt++;
            progress(cnt/10);
            if (cnt===10) {
                clearInterval(tmr);
                resolve();
            }
        },10);
    });
};

export class MainScene extends Scene {

    private logoTexture:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {

        taskQueue.addNextTask(async progress=>{
            this.logoTexture = await taskQueue.getLoader().loadTexture('./assets/logo.png');
        });
        for (let i:number = 0;i<100;i++) {
            taskQueue.addNextTask(async progress=>{
                await wait(progress);
                console.log('tick');
            });
        }

        const rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        rect.fillColor.setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoTexture);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e)=>{
            console.log(e);
        });
    }

}
