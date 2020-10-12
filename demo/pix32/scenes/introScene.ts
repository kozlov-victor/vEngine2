import {KernelBurnAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/kernelBurnAccumulativeFilter";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {GameScene} from "./gameScene";
import {BasePix32Scene} from "./base/basePix32Scene";


export class IntroScene extends BasePix32Scene {

    onReady() {
        super.onReady();
        const box:Rectangle = new Rectangle(this.game);
        box.fillColor = Color.fromCssLiteral('#46e502');
        box.pos.setXY(8,30);
        box.size.setWH(16,4);

        const kernelBurnAccumulative = new KernelBurnAccumulativeFilter(this.game);
        kernelBurnAccumulative.setNoiseIntensity(1.2);
        box.filters = [kernelBurnAccumulative];
        this.screen.appendChild(box);

        this.on(KEYBOARD_EVENTS.keyPressed, _=>{
            this.game.runScene(new GameScene(this.game));
        });

        (async ()=>{
            await this.print("-=... Special for IGDC. 32x32 ...=-",9000);
            await this.print("-=... made with vEngine ...=-",8000);
            await this.print("-=... Pixel Craft 32 competition ...=-",10000);
            await this.print("-=... Press any key to start ...=-",10000, true);
        })();
    }

}
