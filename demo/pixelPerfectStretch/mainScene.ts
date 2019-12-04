import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    private logoPixelLink:ResourceLink<ITexture>;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoPixelLink = this.resourceLoader.loadImage('./pixelPerfectStretch/PixelArt.png');
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        const sprLogo:Image = new Image(this.game);
        sprLogo.setResourceLink(this.logoLink);
        this.appendChild(sprLogo);
        sprLogo.scale.setXY(5);

        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoPixelLink);
        spr.pos.setXY(10,10);
        spr.scale.setXY(10,10);
        spr.borderRadius = 9;
        spr.color.setRGB(12,12,12);
        spr.lineWidth = 0.1;
        this.appendChild(spr);
        this.on(KEYBOARD_EVENTS.keyHold, (e:KeyBoardEvent)=>{
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
        this.on(MOUSE_EVENTS.click, ()=>spr.pixelPerfect=!spr.pixelPerfect);



    }

}
