import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {KEY, KEYBOARD_EVENT} from "@engine/core/control/keyboard";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/core/renderer/color";


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');
        let rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.height = 10;
        this.preloadingGameObject = rect;
    }

    onProgress(val: number) {
        this.preloadingGameObject.width = val*this.game.width;
    }

    onReady() {
        this.logoObj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.spriteSheet = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        this.game.keyboard.on(KEYBOARD_EVENT.KEY_HOLD, (e:KEY)=>{
            switch (e) {
                case KEY.LEFT:
                    this.logoObj.pos.addX(-1);
                    break;
                case KEY.RIGHT:
                    this.logoObj.pos.addX(1);
                    break;
                case KEY.UP:
                    this.logoObj.pos.addY(-1);
                    break;
                case KEY.DOWN:
                    this.logoObj.pos.addY(1);
                    break;
                case KEY.R:
                    this.logoObj.angle+=0.1;
            }
        });

        (window as any).logoObj = this.logoObj;

    }

}