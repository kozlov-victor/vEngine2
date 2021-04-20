import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    private logoLink:ITexture;

    public onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        taskQueue.addNextTask(async progress=>{
            this.logoLink = await taskQueue.getLoader().loadTexture('./assets/repeat.jpg');
        });

    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);
        spr.transformPoint.setToCenter();
        spr.scale.setXY(0.1);
        this.gamepadEventHandler.on(GAME_PAD_EVENTS.buttonHold, (e:IGamePadEvent)=>{

            switch (e.button) {
                case GAME_PAD_BUTTON.STICK_L_LEFT:
                    spr.pos.addX(e.value);
                    break;
                case GAME_PAD_BUTTON.STICK_L_RIGHT:
                    spr.pos.addX(e.value);
                    break;
                case GAME_PAD_BUTTON.STICK_L_UP:
                    spr.pos.addY(e.value);
                    break;
                case GAME_PAD_BUTTON.STICK_L_DOWN:
                    spr.pos.addY(e.value);
                    break;
                case GAME_PAD_BUTTON.BTN_A:
                    spr.angle+=0.1;
                    break;
                case GAME_PAD_BUTTON.BTN_B:
                    spr.angle-=0.1;
                    break;
            }
        });



    }

}
