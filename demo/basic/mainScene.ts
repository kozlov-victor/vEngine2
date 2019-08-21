import {Scene} from "@engine/core/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {KEYBOARD_KEY, KeyboardControl} from "@engine/control/keyboardControl";
import {Image} from "@engine/renderable/impl/geometry/image";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {ITexture} from "@engine/renderer/texture";
import {MouseControl} from "@engine/control/mouse/mouseControl";

export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {
        this.logoObj = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);
        this.on(KEYBOARD_EVENTS.keyHold, (e:KEYBOARD_KEY)=>{
            switch (e) {
                case KEYBOARD_KEY.LEFT:
                    this.logoObj.pos.addX(-1);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.logoObj.pos.addX(1);
                    break;
                case KEYBOARD_KEY.UP:
                    this.logoObj.pos.addY(-1);
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.logoObj.pos.addY(1);
                    break;
                case KEYBOARD_KEY.R:
                    this.logoObj.angle+=0.1;
            }
        });



    }

}
