import {KernelBurnAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/kernelBurnAccumulativeFilter";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {BasePix32Scene, loadSound} from "./base/basePix32Scene";
import {GetReadyScene} from "./getReadyScene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Sound} from "@engine/media/sound";
import {Ym} from "../ym-player/ym";
import {ChipOscilloscope} from "../misc/chipOscilloscope";


export class IntroScene extends BasePix32Scene {

    private themeAudioLink:ResourceLink<void>;
    private ym:Ym;

    onPreloading() {
        super.onPreloading();
        const binLink = this.resourceLoader.loadBinary('pix32/resources/music/theme.ym');
        this.resourceLoader.addNextTask((()=>{
            this.ym = new Ym(binLink.getTarget());
            this.themeAudioLink = loadSound(this.game,this.ym);
        }));
    }

    onReady() {
        super.onReady();

        const sound:Sound = new Sound(this.game);
        sound.setResourceLink(this.themeAudioLink);
        sound.loop = true;
        sound.play();

        const box:Rectangle = new Rectangle(this.game);
        box.fillColor = Color.fromCssLiteral('#46e502');
        box.pos.setXY(8,30);
        box.size.setWH(16,4);

        const kernelBurnAccumulative = new KernelBurnAccumulativeFilter(this.game);
        kernelBurnAccumulative.setNoiseIntensity(1.2);
        box.filters = [kernelBurnAccumulative];
        this.screen.appendChild(box);

        this.oscilloscope.listen(sound,this.ym);

        this.on(KEYBOARD_EVENTS.keyPressed, _=>{
            sound.stop();
            this.game.runScene(new GetReadyScene(this.game));
        });

        (async ()=>{
            await this.print("-=... Special for IGDC. 32x32 ...=-",9000);
            await this.print("-=... made with vEngine ...=-",8000);
            await this.print("-=... Pixel Craft 32 competition ...=-",10000);
            await this.print("-=... Press any key to start ...=-",10000, true);
        })();
    }

}