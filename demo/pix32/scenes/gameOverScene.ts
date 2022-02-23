import {BasePix32Scene, loadSound} from "./base/basePix32Scene";
import {GetReadyScene} from "./getReadyScene";
import {Ym} from "../ym-player/formats/ym";
import {Sound} from "@engine/media/sound";
import {TaskQueue} from "@engine/resources/taskQueue";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class GameOverScene extends BasePix32Scene {

    public score:number = 23440;

    private themeAudioLink:Sound;

    private ym:Ym;

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        let bin:ArrayBuffer;
        taskQueue.addNextTask(async process=>{
            bin = await taskQueue.getLoader().loadBinary('pix32/resources/music/intro.ym',process);
        });
        taskQueue.addNextTask(async _=>{
            const ym  = new Ym(bin);
            this.themeAudioLink = await loadSound(this.game,ym);
            this.ym = ym;
        });
    }

    public override onReady():void {
        super.onReady();
        this.themeAudioLink.loop = true;
        this.themeAudioLink.play();
        this.oscilloscope.listen(this.themeAudioLink,this.ym);
        (async ()=>{
            await this.print(`!Game Over! Your score: ${this.score}`,12000,true);
        })();
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, _=>{
            this.themeAudioLink.stop();
            this.game.runScene(new GetReadyScene(this.game));
        });
    }

}
