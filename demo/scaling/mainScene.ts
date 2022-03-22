import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Tween} from "@engine/animation/tween";
import {Point2d} from "@engine/geometry/point2d";
import {EasingElastic} from "@engine/misc/easing/functions/elastic";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/repeat.jpg')
    private logoLink:ITexture;


    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {

        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(spr);
        spr.transformPoint.setToCenter();
        spr.anchorPoint.setToCenter();
        spr.scale.setXY(0.7);

        this.addTween(new Tween<Point2d>(this.game,{
            delayBeforeStart: 1200,
            target:spr.scale,
            time:800,
            from:{x:0.7,y:0.7},
            to:{x:1.2,y:1.2},
            loop: true,
            yoyo: true,
            numOfLoops: 4,
            ease: EasingElastic.InOut
        }));

    }

}
