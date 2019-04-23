import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {KEYBOARD_EVENT} from "@engine/control/abstract/abstractKeypad";
import {KeyboardControl, KEYBOARD_KEY} from "@engine/control/keyboardControl";
import {GAME_PAD_KEY, GamePadControl} from "@engine/control/gamePadControl";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Texture} from "@engine/renderer/webGl/base/texture";

export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink<Texture>;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');
        let rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    onReady() {
        this.logoObj = new GameObject(this.game);
        let spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        this.game.getControl<KeyboardControl>(KeyboardControl).on(KEYBOARD_EVENT.KEY_HOLD, (e:KEYBOARD_KEY)=>{
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

        this.game.getControl<GamePadControl>(GamePadControl).on(KEYBOARD_EVENT.KEY_HOLD, (e)=>{
            switch (e) {
                case GAME_PAD_KEY.GAME_PAD_AXIS_LEFT:
                    this.logoObj.pos.addX(-1);
                    break;
                case GAME_PAD_KEY.GAME_PAD_AXIS_RIGHT:
                    this.logoObj.pos.addX(1);
                    break;
                case GAME_PAD_KEY.GAME_PAD_AXIS_UP:
                    this.logoObj.pos.addY(-1);
                    break;
                case GAME_PAD_KEY.GAME_PAD_AXIS_DOWN:
                    this.logoObj.pos.addY(1);
                    break;
                case GAME_PAD_KEY.GAME_PAD_1:
                    this.logoObj.angle+=0.1;
                    break;
                case GAME_PAD_KEY.GAME_PAD_3:
                    this.logoObj.angle-=0.1;
                    break;
            }
        });

        (window as any).logoObj = this.logoObj;

    }

}
