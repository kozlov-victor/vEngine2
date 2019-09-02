import {Scene} from "@engine/core/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {NinePatchImage} from "@engine/renderable/impl/geometry/ninePatchImage";

export class MainScene extends Scene {

    private obj:NinePatchImage;
    private imgLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.imgLink = this.resourceLoader.loadImage('./ninePatchImage/ninePatchImage.png');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {
        this.obj = new NinePatchImage(this.game);
        this.obj.setResourceLink(this.imgLink);

        this.obj.size.setWH(200,200);
        this.obj.setABCD(20);
        this.obj.pos.setXY(20,20);

        this.appendChild(this.obj);
        this.on(KEYBOARD_EVENTS.keyHold, (e:KeyBoardEvent)=>{
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

        (window as any).obj = this.obj;

    }

}
