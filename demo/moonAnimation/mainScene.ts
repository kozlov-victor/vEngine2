import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SpriterObject} from "../scml/scml";
import {Sound} from "@engine/media/sound";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";


export class MainScene extends Scene {

    private player:SpriterObject;
    private sound:Sound = new Sound(this.game);

    public onPreloading() {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;


        this.player = new SpriterObject(this.game);
        this.player.preload({url:'./moonAnimation/moon/moon.scon',headers:[{name:'test-header',value:'nonsense'}],responseType:'text'});

        this.sound.setResourceLink(this.resourceLoader.loadSound('./moonAnimation/moon_sound.wav'));

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        this.sound.play();
        this.appendChild(this.player);
        this.player.pos.setXY(this.game.size.width/2,this.game.size.height/2+40);

        this.on(MOUSE_EVENTS.click, ()=>{
            this.sound.play();
            this.player.nextAnimation();
        });

        this.filters = [new WaveFilter(this.game)];

    }

}
