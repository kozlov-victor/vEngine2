
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SpriterObject} from "../scml/scml";

// models: https://craftpix.net/freebies/2d-fantasy-fairy-free-character-sprite/


export class MainScene extends Scene {

    private player:SpriterObject;


    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        this.player = new SpriterObject(this.game);
        this.player.preload('./scml6/fair/1.scon');


    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        this.appendChild(this.player);
        this.player.scale.setXY(0.3);
        this.player.pos.setXY(200,300);

        this.on(MOUSE_EVENTS.click, ()=>{
            this.player.nextAnimation();
        });
    }

}
