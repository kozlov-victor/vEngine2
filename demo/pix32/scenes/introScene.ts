import {KernelBurnAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/kernelBurnAccumulativeFilter";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvent";
import {BasePix32Scene, loadSound} from "./base/basePix32Scene";
import {GetReadyScene} from "./getReadyScene";
import {Sound} from "@engine/media/sound";
import {AbstractChipTrack} from "../ym-player/abstract/abstractChipTrack";
import {Ym} from "../ym-player/formats/ym";
import {TaskQueue} from "@engine/resources/taskQueue";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class IntroScene extends BasePix32Scene {

    private themeAudioLink:Sound;
    private track:AbstractChipTrack;

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        let bin:ArrayBuffer;
        taskQueue.addNextTask(async process=>{
            bin = await taskQueue.getLoader().loadBinary('pix32/resources/music/theme.ym',process);
        });
        taskQueue.getLoader().addNextTask(async _=>{
            this.track = new Ym(bin);
            this.themeAudioLink = await loadSound(this.game,this.track);
        });
    }

    public override onReady():void {
        super.onReady();

        const sound:Sound = this.themeAudioLink;
        sound.loop = true;
        sound.play();

        const box:Rectangle = new Rectangle(this.game);
        box.fillColor = ColorFactory.fromCSS('#46e502');
        box.pos.setXY(8,20);
        box.size.setWH(16,4);

        const kernelBurnAccumulative = new KernelBurnAccumulativeFilter(this.game);
        kernelBurnAccumulative.setNoiseIntensity(1.2);
        box.filters = [kernelBurnAccumulative];
        this.screen.appendChild(box);

        this.oscilloscope.listen(sound,this.track);

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, _=>{
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
