import {Scene} from "@engine/model/impl/general/scene";
import {GameObject} from "@engine/model/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/model/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {KEYBOARD_KEY, KeyboardControl} from "@engine/control/keyboardControl";
import {GAME_PAD_KEY, GamePadControl} from "@engine/control/gamePadControl";
import {Image, STRETCH_MODE} from "@engine/model/impl/geometry/image";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {
    
    private logoObj:GameObject;
    private logoLink:ResourceLink<Texture>;
    private bgLink:ResourceLink<Texture>;

    public onPreloading() {
        this.width = 1100;
        this.height = 2100;
        this.logoLink = this.resourceLoader.loadImage("./assets/logo.png");
        this.bgLink = this.resourceLoader.loadImage("./assets/repeat.jpg");
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
        spr.size.setWH(250,300);
        spr.stretchMode = STRETCH_MODE.REPEAT;
        spr.offset.setXY(1,1);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        const bg:Image = new Image(this.game);
        bg.setResourceLink(this.bgLink);
        bg.size.setWH(1000,2000);
        bg.stretchMode = STRETCH_MODE.REPEAT;
        this.appendChild(bg);
        this.logoObj.moveToFront();

        this.game.camera.followTo(this.logoObj);

        this.game.getControl<KeyboardControl>(KeyboardControl).on(KEYBOARD_EVENTS.KEY_HOLD, (e:KEYBOARD_KEY)=>{
            switch (e) {
                case KEYBOARD_KEY.LEFT:
                    this.logoObj.pos.addX(-5);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.logoObj.pos.addX(5);
                    break;
                case KEYBOARD_KEY.UP:
                    this.logoObj.pos.addY(-5);
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.logoObj.pos.addY(5);
                    break;
                case KEYBOARD_KEY.R:
                    this.logoObj.angle+=0.1;
            }
        });

        this.game.getControl<GamePadControl>(GamePadControl).on(KEYBOARD_EVENTS.KEY_HOLD, (e)=>{
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
