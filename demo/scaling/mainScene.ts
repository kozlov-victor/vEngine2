import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {MathEx} from "@engine/misc/mathEx";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./assets/repeat.jpg');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {

        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.setXY(10,10);
        this.appendChild(spr);
        spr.transformPoint.setToCenter();
        //spr.scale.setXY(0.1);

        const from:number = 1;
        const to:number = 1.1;
        const target = spr;
        const time:number = 3000;

        const tm:TweenMovie = new TweenMovie(this.game);
        tm.addTween(0,{
            target:{val:from},
            progress:(obj:{val:number})=>{
                target.scale.setXY(obj.val);
            },
            time,
            from:{val:from},
            to:{val:to}
        });
        tm.addTween(time,{
            target:{val:to},
            progress:(obj:{val:number})=>{
                target.scale.setXY(obj.val);
            },
            time,
            from:{val:to},
            to:{val:from}
        });
        tm.loop(true);
        this.addTweenMovie(tm);

    }

}
