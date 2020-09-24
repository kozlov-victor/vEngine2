import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Tween} from "@engine/animation/tween";
import {Point2d} from "@engine/geometry/point2d";
import {EasingElastic} from "@engine/misc/easing/functions/elastic";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./assets/repeat.jpg');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(spr);
        spr.transformPoint.setToCenter();
        spr.anchorPoint.setToCenter();
        spr.scale.setXY(0.7);

        this.addTween(new Tween<Point2d>({
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
