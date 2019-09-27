import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Scene} from "@engine/scene/scene";
import {SpriterObject} from "../scml/scml";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


export class MainScene extends Scene {

    private lobster:SpriterObject;

    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        this.lobster = new SpriterObject(this.game);
        this.lobster.preload('./scml2/lobster/lobster.scon');


    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {

        document.body.style.cssText = 'background-color:grey;';

        this.appendChild(this.lobster);
        this.lobster.scale.setXY(1,-1);
        this.lobster.pos.setXY(120,120);

        this.on(MOUSE_EVENTS.click, ()=>{
            this.lobster.nextAnimation();
        });

    }

}
