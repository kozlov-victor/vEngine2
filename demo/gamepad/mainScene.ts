import {Scene} from "@engine/core/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ITexture} from "@engine/renderer/texture";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {GAME_PAD_EVENTS, GamePadEvent} from "@engine/control/gamepad/gamePadEvents";

export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/repeat.jpg');
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
        this.logoObj.rotationPoint.setToCenter();
        this.logoObj.scale.setXY(0.1);
        this.on(GAME_PAD_EVENTS.buttonHold, (e:GamePadEvent)=>{

            this.game.log(new Date().getTime() + ' ' + e.value);

            switch (e.button) {
                case GAME_PAD_BUTTON.STICK_L_LEFT:
                    this.logoObj.pos.addX(-1);
                    break;
                case GAME_PAD_BUTTON.STICK_L_RIGHT:
                    this.logoObj.pos.addX(1);
                    break;
                case GAME_PAD_BUTTON.STICK_L_UP:
                    this.logoObj.pos.addY(-1);
                    break;
                case GAME_PAD_BUTTON.STICK_L_DOWN:
                    this.logoObj.pos.addY(1);
                    break;
                case GAME_PAD_BUTTON.BTN_A:
                    this.logoObj.angle+=0.1;
                    break;
                case GAME_PAD_BUTTON.BTN_B:
                    this.logoObj.angle-=0.1;
                    break;
            }
        });



    }

}
