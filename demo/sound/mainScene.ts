import {Scene} from "@engine/core/scene";
import {Sound} from "@engine/media/sound";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ResourceLink} from "@engine/resources/resourceLink";


export class MainScene extends Scene {

    private sound!:Sound;
    private resourceLink!:ResourceLink<void>;

    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadSound('./sound/sound.mp3');

        const sound:Sound = new Sound(this.game);
        (window as any).sound = sound;
        this.sound = sound;
        sound.setResourceLink(this.resourceLink);

        this.on(MOUSE_EVENTS.mouseDown,()=>{
            sound.play();
        });

    }

    public onProgress(val: number) {

    }

    public onReady() {
        console.log('ready');
    }

}
