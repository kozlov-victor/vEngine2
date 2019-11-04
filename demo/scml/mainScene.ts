
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {SpriterObject} from "./scml";
import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


export class MainScene extends Scene {

    private player:SpriterObject;

    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;


        this.player = new SpriterObject(this.game);
        this.player.preload({url:'./scml/player/player.scon',headers:[{name:'test-header',value:'nonsense'}],responseType:'text'});

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {


        this.appendChild(this.player);
        this.player.scale.setXY(0.6);
        this.player.pos.setXY(200,200);

        this.on(MOUSE_EVENTS.click, ()=>this.player.nextAnimation());
    }

}
