import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {TaskQueue} from "@engine/resources/taskQueue";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./pixelPerfectStretch/PixelArt.png')
    private logoPixelLink:ITexture;

    @Resource.Texture('./assets/logo.png')
    private logoLink:ITexture;

    public onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {

        const sprLogo:Image = new Image(this.game,this.logoLink);
        this.appendChild(sprLogo);
        sprLogo.scale.setXY(5);

        const spr:Image = new Image(this.game,this.logoPixelLink);
        spr.pos.setXY(10,10);
        spr.scale.setXY(10,10);
        spr.borderRadius = 9;
        spr.lineWidth = 0.1;
        this.appendChild(spr);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.key) {
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
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>spr.setPixelPerfect(!spr.isPixelPerfect()));

    }

}
