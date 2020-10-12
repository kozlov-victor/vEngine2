import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {fakeLongLoadingFn} from "../longLoading/mainScene";
import {Color} from "@engine/renderer/common/color";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";

export class SecondScene extends Scene {

    public onPreloading(){
        this.backgroundColor.set(Color.BLACK);
        for (let i:number = 0;i<60;i++) { fakeLongLoadingFn(this.resourceLoader); }
        const rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        rect.fillColor.setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {
        const rect:Rectangle = new Rectangle(this.game);
        rect.pos.setXY(50,50);
        rect.size.setWH(120,220);

        this.on(MOUSE_EVENTS.click, e=>{
            this.game.popScene();
        });
        this.appendChild(rect);
        this.filters = [new Barrel2DistortionFilter(this.game)];
    }

}
