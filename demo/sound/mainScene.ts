import {Scene} from "@engine/scene/scene";
import {Sound} from "@engine/media/sound";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ResourceLink} from "@engine/resources/resourceLink";
import {MathEx} from "@engine/misc/mathEx";


export class MainScene extends Scene {

    private resourceLink!:ResourceLink<void>;

    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadSound('./sound/sound.mp3');

        const sound:Sound = new Sound(this.game);
        sound.setResourceLink(this.resourceLink);

        // this.setInterval(()=>{
        //     sound.stereoPan = MathEx.random(-1,1);
        //     sound.velocity = MathEx.random(0.1,1.1);
        //     sound.gain = MathEx.random(0.5,1);
        //     sound.play();
        // },800);

        this.on(MOUSE_EVENTS.mouseDown,()=>{
            sound.stereoPan = MathEx.random(-1,1);
            sound.velocity = MathEx.random(0.6,1);
            sound.gain = MathEx.random(0.5,1);
            sound.play();
        });

    }

    public onProgress(val: number) {

    }

    public onReady() {
        console.log('ready');
    }

}
