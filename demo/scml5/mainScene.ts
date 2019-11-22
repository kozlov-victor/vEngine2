
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SpriterObject} from "../scml/scml";

// models: https://github.com/treefortress/SpriterAS
// https://github.com/ibilon/HaxePunk-Spriter/tree/master/demo/assets/sprites


export class MainScene extends Scene {

    private player:SpriterObject;
    private mage:SpriterObject;
    private imp:SpriterObject;
    private brawler:SpriterObject;

    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;


        this.player = new SpriterObject(this.game);
        this.player.preload('./scml5/orc/orc.scon');

        this.mage = new SpriterObject(this.game);
        this.mage.preload('./scml5/mage/mage.scon');

        this.imp = new SpriterObject(this.game);
        this.imp.preload('./scml5/imp/imp.scon');

        this.brawler = new SpriterObject(this.game);
        this.brawler.preload('./scml5/brawler/brawler.scon');

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {


        this.appendChild(this.player);
        this.player.scale.setXY(0.6);
        this.player.pos.setXY(200,200);

        this.appendChild(this.mage);
        this.mage.scale.setXY(0.6);
        this.mage.pos.setXY(100,100);

        this.appendChild(this.imp);
        this.imp.scale.setXY(0.6);
        this.imp.pos.setXY(500,100);

        this.appendChild(this.brawler);
        this.brawler.scale.setXY(0.6);
        this.brawler.pos.setXY(500,300);

        this.on(MOUSE_EVENTS.click, ()=>{
            this.player.nextAnimation();
            this.mage.nextAnimation();
            this.imp.nextAnimation();
            this.brawler.nextAnimation();
        });
    }

}
