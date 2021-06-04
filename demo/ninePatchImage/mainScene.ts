import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {NinePatchImage} from "@engine/renderable/impl/general/ninePatchImage";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    private obj:NinePatchImage;

    @Resource.Texture('./ninePatchImage/ninePatchImage.png')
    private imgLink:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        this.obj = new NinePatchImage(this.game,this.imgLink);

        this.obj.size.setWH(200,200);
        this.obj.setABCD(20);
        this.obj.pos.setXY(20,20);

        this.appendChild(this.obj);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.key) {
                case KEYBOARD_KEY.LEFT:
                    this.obj.size.width-=1;
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.obj.size.width+=1;
                    break;
                case KEYBOARD_KEY.UP:
                    this.obj.size.height-=1;
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.obj.size.height+=1;
                    break;
            }
        });

    }

}
