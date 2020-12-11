import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {FindFreePointStrategy, WaterRippleFilter} from "@engine/renderer/webGl/filters/texture/waterRippleFilter";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MathEx} from "@engine/misc/mathEx";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading():void {
        this.logoLink = this.resourceLoader.loadTexture('./assets/repeat.jpg');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.size.setWH(this.game.size.width,this.game.size.height);
        this.appendChild(spr);

        const waterRipple = new WaterRippleFilter(this.game);
        waterRipple.findFreePointStrategy = FindFreePointStrategy.GET_OLDEST;
        this.filters = [waterRipple];

        this.on(MOUSE_EVENTS.click, e=>{
            waterRipple.dropAt(e.sceneX,e.sceneY);
        });

        if (window.top===self) this.game.getRenderer().requestFullScreen();

        this.setInterval(()=>{
            waterRipple.dropAt(
                MathEx.randomInt(0,this.game.size.width),
                MathEx.randomInt(0,this.game.size.height)
            );
        },1000);

    }

}
