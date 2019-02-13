import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {KEY, KEYBOARD_EVENT} from "@engine/core/control/keyboard";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/core/renderer/color";
import {Sound} from "@engine/model/impl/sound";
import {MOUSE_EVENTS} from "@engine/core/control/mouse";




export class MainScene extends Scene {

    private sound:Sound;
    private resourceLink:ResourceLink;

    onPreloading() {
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
