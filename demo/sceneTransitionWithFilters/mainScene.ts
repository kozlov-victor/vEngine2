import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {SecondScene} from "./secondScene";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {VignetteFilter} from "@engine/renderer/webGl/filters/texture/vignetteFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";


export class MainScene extends Scene {

    public fnt!:Font;

    public onPreloading(): void {
        super.onPreloading();
        this.colorBG.set(Color.RGB(100,40,40));
    }


    public onReady() {
        const rect:Rectangle = new Rectangle(this.game);
        rect.pos.setXY(20,20);
        rect.size.setWH(200,120);

        const secondScene = new SecondScene(this.game);

        this.on(MOUSE_EVENTS.click, e=>{
            this.game.pushScene(secondScene,new CurtainsOpeningTransition(this.game,5000));
        });
        this.appendChild(rect);
        this.filters = [new NoiseHorizontalFilter(this.game)];
    }
}
