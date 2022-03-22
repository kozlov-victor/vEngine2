import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {VideoGlitchFilter} from "@engine/renderer/webGl/filters/texture/videoGlitchFilter";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {TaskQueue} from "@engine/resources/taskQueue";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {

    private logoLink:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        taskQueue.addNextTask(async progress=>{
            this.logoLink = await taskQueue.getLoader().loadTexture('./assets/logo.png',progress);
        });

    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    spr.pos.addX(-1);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    spr.pos.addX(1);
                    break;
                case KEYBOARD_KEY.UP:
                    spr.pos.addY(-1);
                    break;
                case KEYBOARD_KEY.DOWN:
                    spr.pos.addY(1);
                    break;
                case KEYBOARD_KEY.R:
                    spr.angle+=0.1;
            }
        });
        this.filters = [new VideoGlitchFilter(this.game)];
    }

}
