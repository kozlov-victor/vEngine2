import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {FindFreePointStrategy, WaterRippleFilter} from "@engine/renderer/webGl/filters/texture/waterRippleFilter";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MathEx} from "@engine/misc/mathEx";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/repeat.jpg')
    private logoLink:ITexture;

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.size.setWH(this.game.size.width,this.game.size.height);
        this.appendChild(spr);

        const waterRipple = new WaterRippleFilter(this.game);
        waterRipple.findFreePointStrategy = FindFreePointStrategy.GET_OLDEST;
        this.filters = [waterRipple];

        this.mouseEventHandler.on(MOUSE_EVENTS.click, e=>{
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
