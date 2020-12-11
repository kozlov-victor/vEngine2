import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Scene} from "@engine/scene/scene";
import {SpriterObject} from "../scml/scml";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


export class MainScene extends Scene {

    private lobster:SpriterObject;

    public onPreloading():void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        this.lobster = new SpriterObject(this.game);
        this.lobster.preload('./scml2/lobster/lobster.scon');


    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {

        document.body.style.cssText = 'background-color:grey;';

        this.appendChild(this.lobster);
        this.lobster.pos.setXY(120,120);

        this.on(MOUSE_EVENTS.click, ()=>{
            this.lobster.nextAnimation();
        });

    }

}
