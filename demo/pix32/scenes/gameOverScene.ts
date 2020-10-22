import {BasePix32Scene, loadSound} from "./base/basePix32Scene";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {GetReadyScene} from "./getReadyScene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Ym} from "../ym-player/ym";
import {Sound} from "@engine/media/sound";

export class GameOverScene extends BasePix32Scene {

    public score:number = 23440;

    private themeAudioLink:ResourceLink<void>;

    private ym:Ym;

    onPreloading() {
        super.onPreloading();
        const binLink = this.resourceLoader.loadBinary('pix32/resources/music/intro.ym');
        this.resourceLoader.addNextTask((()=>{
            const ym  = new Ym(binLink.getTarget());
            this.themeAudioLink = loadSound(this.game,ym);
            this.ym = ym;
        }));
    }

    onReady() {
        super.onReady();
        const sound:Sound = new Sound(this.game);
        sound.setResourceLink(this.themeAudioLink);
        sound.loop = true;
        sound.play();
        this.oscilloscope.listen(sound,this.ym);
        (async ()=>{
            await this.print(`!Game Over! Your score: ${this.score}`,12000,true);
        })();
        this.on(KEYBOARD_EVENTS.keyPressed, _=>{
            sound.stop();
            this.game.runScene(new GetReadyScene(this.game));
        });
    }

}
