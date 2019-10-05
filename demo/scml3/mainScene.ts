import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Scene} from "@engine/scene/scene";
import {SpriterObject} from "../scml/scml";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

// https://github.com/miletbaker/spriter2moai

export class MainScene extends Scene {

    private monster:SpriterObject;

    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        this.monster = new SpriterObject(this.game);
        this.monster.preload('./scml3/monster/monster.scon');


    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {

        this.appendChild(this.monster);
        this.monster.scale.setXY(0.7);
        this.monster.pos.setXY(120,600);

        this.on(MOUSE_EVENTS.click, ()=>this.monster.nextAnimation());

    }

}
