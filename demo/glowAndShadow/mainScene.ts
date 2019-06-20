import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {GlowFilter} from "@engine/renderer/webGl/filters/texture/glowFilter";
import {Color} from "@engine/renderer/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {TweenMovie} from "@engine/misc/tweenMovie";

export class MainScene extends Scene {

    private logoLink:ResourceLink<Texture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');

    }


    public onReady() {
        const circle:Circle = new Circle(this.game);
        circle.radius = 90;
        circle.center.setXY(120,120);
        circle.color = Color.RGB(30,40,55);
        circle.addBehaviour(new DraggableBehaviour(this.game));
        circle.color = Color.RGB(0,100,12);
        circle.arcAngleFrom = -2;
        circle.arcAngleTo = 2;

        const glow:GlowFilter = new GlowFilter(this.game);
        glow.setGlowColor(Color.RGB(12,100,12));
        circle.filters = [glow];

        this.appendChild(circle);

        const tm:TweenMovie = new TweenMovie(this.game);
        tm.tween(0,{
            target:{val:0},
            progress:(obj:{val:number})=>{
                 glow.setOuterStrength(obj.val);
            },
            time:2000,
            from:{val:0},
            to:{val:5}
        });
        tm.tween(2000,{
            target:{val:5},
            progress:(obj:{val:number})=>{
                glow.setOuterStrength(obj.val);
            },
            time:2000,
            from:{val:5},
            to:{val:0}
        });
        tm.loop(true);
        this.addTweenMovie(tm);
    }

}
