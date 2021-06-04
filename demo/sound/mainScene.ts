import {Scene} from "@engine/scene/scene";
import {Sound} from "@engine/media/sound";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MathEx} from "@engine/misc/mathEx";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Sound('./sound/sound.mp3')
    private resourceLink:Sound;


    public override onReady():void {
        console.log('ready');
        const sound = this.resourceLink;
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseDown,()=>{
            sound.stereoPan = MathEx.random(-1,1);
            sound.velocity = MathEx.random(0.6,1);
            sound.gain = MathEx.random(0.5,1);
            sound.play();
        });
    }

}
