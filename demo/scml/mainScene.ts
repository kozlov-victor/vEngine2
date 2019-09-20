import {Scene} from "@engine/core/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {SpriterObject} from "./scml";


export class MainScene extends Scene {

    private spriterObject:SpriterObject;

    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        this.spriterObject = new SpriterObject(this.game);
        this.spriterObject.preload({url:'./scml/player/player.scon',headers:[{name:'test-header',value:'nonsense'}],responseType:'text'});

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {

        this.appendChild(this.spriterObject);
        this.spriterObject.scale.setXY(0.6,-0.6);
        this.spriterObject.pos.setXY(200);
    }

}
