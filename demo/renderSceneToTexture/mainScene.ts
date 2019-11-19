import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/geometry/image";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";

export class MainScene extends Scene {

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
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
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
                    break;
            }
        });

        let i:Image;

        this.setInterval(()=>{
            if (i!==undefined) {this.removeChild(i);}
            const l:ResourceLink<ITexture> = this.renderToTexture();
            const img = new Image(this.game);
            img.filters = [new BlackWhiteFilter(this.game)];
            img.scale.setXY(0.4);
            img.setResourceLink(l);
            img.lineWidth = 2;
            img.color = Color.RGB(100,200,11);
            img.borderRadius = 5;
            this.appendChild(img);
            i = img;
        },1);

    }

}
