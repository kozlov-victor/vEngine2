import {Scene} from "@engine/model/impl/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Sound} from "@engine/model/impl/sound";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {Texture} from "@engine/renderer/webGl/base/texture";


export class MainScene extends Scene {

    private sound:Sound;
    private resourceLink:ResourceLink<void>;

    onPreloading() {
        this.game.setAudioPLayer(AudioPlayer);
        this.resourceLink = this.resourceLoader.loadSound('../assets/sound.mp3');

        const sound:Sound = new Sound(this.game);
        this.sound = sound;
        sound.setResourceLink(this.resourceLink);

        this.on(MOUSE_EVENTS.mouseDown,()=>{
            sound.play();
        });

        (window as any).sound = sound;

    }

    onProgress(val: number) {

    }

    onReady() {
        console.log('ready');
    }

}
